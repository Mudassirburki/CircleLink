const functions = require('firebase-functions');
const admin = require('firebase-admin');

const db = admin.firestore();

/**
 * 👤 TRIGGER: Follow Created (follows/{followId})
 */
exports.onFollowCreated = functions.firestore
    .document('follows/{followId}')
    .onCreate(async (snapshot, context) => {
        const data = snapshot.data();
        const { followerId, followingId: followedId } = data;
        console.log(`[Notification: Follow] Followed: ${followedId}, Follower: ${followerId}`);

        if (followedId === followerId) {
            return console.log('[Trigger: Follow] Suppression: Self-follow.');
        }

        const followerSnap = await db.collection('users').doc(followerId).get();
        const followerName = followerSnap.data()?.name || 'Someone';

        // 1. Log to history
        await db.collection('notifications').doc(followedId).collection('userNotifications').add({
            type: 'follow',
            title: 'New Follower! 👤',
            body: `${followerName} started following you`,
            senderUserId: followerId,
            read: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // 2. Fetch preference & token
        const ownerSnap = await db.collection('users').doc(followedId).get();
        const ownerData = ownerSnap.data();

        if (ownerData?.pushNotificationsEnabled === false) {
            return console.log(`[Trigger: Follow] Suppression: User ${followedId} disabled push.`);
        }

        const token = ownerData?.fcmToken;
        if (!token) return console.log(`[Trigger: Follow] Fail: No token for ${followedId}`);

        // 3. Send Push
        try {
            const message = {
                token: token,
                notification: {
                    title: 'New Follower! 👤',
                    body: `${followerName} started following you`,
                },
                data: {
                    type: 'follow',
                    userId: followerId
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
            console.log(`[Notification: Follow] Success: Push sent to ${followedId}`);
        } catch (error) {
            console.error(`[Notification: Follow] Error sending push to ${followedId}:`, error);
        }
    });
