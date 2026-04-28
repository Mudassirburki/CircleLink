const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const NotificationService = require('./services/NotificationService');

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

        // 2. Handle Grouping and Sending via Service
        try {
            await NotificationService.handleLikeGrouping(ownerId, likerId, postId, likerName);
        } catch (error) {
            console.error('[Trigger: Like] Error:', error);
        }
    });
