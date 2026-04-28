const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const NotificationService = require('./services/NotificationService');

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

        // Use standard service
        try {
            await NotificationService.sendNotification({
                recipientId: ownerId,
                senderId: commenterId,
                type: 'comment',
                title: 'New Comment! 💬',
                body: `${commenterName}: ${text}`,
                data: { postId, userId: commenterId }
            });
        } catch (error) {
            console.error('[Trigger: Comment] Error:', error);
        }
    });
