const functions = require('firebase-functions');
const admin = require('firebase-admin');

const db = admin.firestore();

/**
 * 💬 TRIGGER: Comment Created (comments/{commentId})
 */
exports.onCommentCreated = functions.firestore
    .document('comments/{commentId}')
    .onCreate(async (snapshot, context) => {
        const data = snapshot.data();
        const { postId, userId: commenterId, text } = data;
        console.log(`[Trigger: Comment] Post: ${postId}, Commenter: ${commenterId}`);

        const postSnap = await db.collection('posts').doc(postId).get();
        const postData = postSnap.data();
        if (!postData) return console.log('[Trigger: Comment] Fail: Post not found');

        const ownerId = postData.userId;
        if (ownerId === commenterId) {
            return console.log('[Trigger: Comment] Suppression: Self-comment.');
        }

        const commenterSnap = await db.collection('users').doc(commenterId).get();
        const commenterName = commenterSnap.data()?.name || 'Someone';

        // 1. Log to history
        await db.collection('notifications').doc(ownerId).collection('userNotifications').add({
            type: 'comment',
            title: 'New Comment! 💬',
            body: `${commenterName}: ${text}`,
            senderUserId: commenterId,
            postId: postId,
            read: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // 2. Fetch preference & token
        const ownerSnap = await db.collection('users').doc(ownerId).get();
        const ownerData = ownerSnap.data();

        if (ownerData?.pushNotificationsEnabled === false) {
            return console.log(`[Trigger: Comment] Suppression: User ${ownerId} disabled push.`);
        }

        const token = ownerData?.fcmToken;
        if (!token) return console.log(`[Trigger: Comment] Fail: No token for ${ownerId}`);

        // 3. Send Push
        try {
            const message = {
                token: token,
                notification: {
                    title: 'New Comment! 💬',
                    body: `${commenterName}: ${text}`,
                },
                data: {
                    type: 'comment',
                    postId: postId,
                    userId: commenterId
                },
                android: {
                    priority: 'high',
                    notification: {
                        channelId: 'default',
                        clickAction: 'TOP_LEVEL_NAVIGATOR',
                        icon: 'ic_launcher',
                        color: '#AF1A5D'
                    }
                },
                apns: {
                    payload: {
                        aps: {
                            sound: 'default',
                            badge: 1
                        }
                    }
                }
            };

            await admin.messaging().send(message);
            console.log(`[Notification: Comment] Success: Push sent to ${ownerId}`);
        } catch (error) {
            console.error(`[Notification: Comment] Error sending push to ${ownerId}:`, error);
        }
    });
