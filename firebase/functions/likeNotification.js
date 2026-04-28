const functions = require('firebase-functions');
const admin = require('firebase-admin');

// db instance from admin (shared across modules)
const db = admin.firestore();

/**
 * ❤️ TRIGGER: Like Created (likes/{likeId})
 */
exports.onLikeCreated = functions.firestore
    .document('likes/{likeId}')
    .onCreate(async (snapshot, context) => {
        const data = snapshot.data();
        const { postId, userId: likerId } = data;
        console.log(`[Trigger: Like] Post: ${postId}, Liker: ${likerId}`);

        // 1. Prevent self-notifications
        const postSnap = await db.collection('posts').doc(postId).get();
        const postData = postSnap.data();
        if (!postData) return console.log('[Trigger: Like] Fail: Post not found');

        const ownerId = postData.userId;
        if (ownerId === likerId) {
            return console.log('[Trigger: Like] Suppression: Self-like.');
        }

        const likerSnap = await db.collection('users').doc(likerId).get();
        const likerName = likerSnap.data()?.name || 'Someone';

        // 2. Clear old notifications/Add to history
        await db.collection('notifications').doc(ownerId).collection('userNotifications').add({
            type: 'like',
            title: 'New Like! ❤️',
            body: `${likerName} liked your post`,
            senderUserId: likerId,
            postId: postId,
            read: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // 3. Fetch recipient preference & token
        const ownerSnap = await db.collection('users').doc(ownerId).get();
        const ownerData = ownerSnap.data();

        if (ownerData?.pushNotificationsEnabled === false) {
            return console.log(`[Trigger: Like] Suppression: User ${ownerId} disabled push.`);
        }

        const token = ownerData?.fcmToken;
        if (!token) return console.log(`[Trigger: Like] Fail: No token for ${ownerId}`);

        // 4. Send Push
        try {
            const message = {
                token: token,
                notification: {
                    title: 'New Like! ❤️',
                    body: `${likerName} liked your post`,
                },
                data: {
                    type: 'like',
                    postId: postId,
                    userId: likerId
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
            console.log(`[Notification: Like] Success: Push sent to ${ownerId}`);
        } catch (error) {
            console.error(`[Notification: Like] Error sending push to ${ownerId}:`, error);
        }
    });
