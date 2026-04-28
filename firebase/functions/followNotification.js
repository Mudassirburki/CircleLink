const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const NotificationService = require('./services/NotificationService');

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

        // Use standard service
        try {
            await NotificationService.sendNotification({
                recipientId: followedId,
                senderId: followerId,
                type: 'follow',
                title: 'New Follower! 👤',
                body: `${followerName} started following you`,
                data: { userId: followerId }
            });
        } catch (error) {
            console.error('[Trigger: Follow] Error:', error);
        }
    });
