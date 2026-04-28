const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

/**
 * Utility to send notifications and save to history
 */
async function sendNotification(targetUserId, senderId, payload, notificationData) {
    // 1. Prevent self-notifications
    if (targetUserId === senderId) return null;

    // 2. Fetch target user's FCM tokens
    const userSnap = await db.collection('users').doc(targetUserId).get();
    const userData = userSnap.data();
    if (!userData || !userData.fcmTokens || userData.fcmTokens.length === 0) return null;

    // 3. Save to In-App Notification History (Pro Feature)
    await db.collection('users').doc(targetUserId).collection('notifications').add({
        ...notificationData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        read: false,
        senderId: senderId
    });

    // 4. Send Push Notification via FCM
    const message = {
        notification: payload.notification,
        data: payload.data,
        tokens: userData.fcmTokens,
    };

    try {
        const response = await admin.messaging().sendEachForMulticast(message);
        console.log(`Successfully sent ${response.successCount} messages`);
        
        // Handle invalid tokens (Advanced Feature)
        if (response.failureCount > 0) {
            const failedTokens = [];
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    failedTokens.push(userData.fcmTokens[idx]);
                }
            });
            if (failedTokens.length > 0) {
                await db.collection('users').doc(targetUserId).update({
                    fcmTokens: admin.firestore.FieldValue.arrayRemove(...failedTokens)
                });
            }
        }
        return response;
    } catch (error) {
        console.error('Error sending multicast message:', error);
        return null;
    }
}

/**
 * Trigger: Like Created
 */
exports.onLikeCreated = functions.firestore
    .document('posts/{postId}/likes/{userId}')
    .onCreate(async (snapshot, context) => {
        const { postId, userId: likerId } = context.params;
        const postSnap = await db.collection('posts').doc(postId).get();
        const postData = postSnap.data();

        if (!postData) return;

        const ownerId = postData.userId;
        const likerSnap = await db.collection('users').doc(likerId).get();
        const likerData = likerSnap.data();

        const payload = {
            notification: {
                title: 'New Like!',
                body: `${likerData.username} liked your post ❤️`,
            },
            data: {
                type: 'LIKE',
                postId: postId,
                userId: likerId
            },
        };

        const historyData = {
            title: 'New Like!',
            message: `${likerData.username} liked your post`,
            type: 'LIKE',
            postId: postId
        };

        return sendNotification(ownerId, likerId, payload, historyData);
    });

/**
 * Trigger: Comment Created
 */
exports.onCommentCreated = functions.firestore
    .document('posts/{postId}/comments/{commentId}')
    .onCreate(async (snapshot, context) => {
        const { postId } = context.params;
        const commentData = snapshot.data();
        const commenterId = commentData.userId;

        const postSnap = await db.collection('posts').doc(postId).get();
        const postData = postSnap.data();

        if (!postData) return;

        const ownerId = postData.userId;

        const payload = {
            notification: {
                title: 'New Comment!',
                body: `${commentData.username}: ${commentData.text} 💬`,
            },
            data: {
                type: 'COMMENT',
                postId: postId,
                userId: commenterId
            },
        };

        const historyData = {
            title: 'New Comment!',
            message: `${commentData.username} commented on your post`,
            type: 'COMMENT',
            postId: postId
        };

        return sendNotification(ownerId, commenterId, payload, historyData);
    });

/**
 * Trigger: Follow Created
 * Path: followers/{userId}/userFollowers/{followerId}
 */
exports.onFollowCreated = functions.firestore
    .document('followers/{userId}/userFollowers/{followerId}')
    .onCreate(async (snapshot, context) => {
        const { userId: followedId, followerId } = context.params;

        const followerSnap = await db.collection('users').doc(followerId).get();
        const followerData = followerSnap.data();

        const payload = {
            notification: {
                title: 'New Follower!',
                body: `${followerData.username} started following you 👤`,
            },
            data: {
                type: 'FOLLOW',
                userId: followerId
            },
        };

        const historyData = {
            title: 'New Follower!',
            message: `${followerData.username} started following you`,
            type: 'FOLLOW',
            userId: followerId
        };

        return sendNotification(followedId, followerId, payload, historyData);
    });
