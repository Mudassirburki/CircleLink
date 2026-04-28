const admin = require('firebase-admin');
const db = admin.firestore();

class NotificationService {
    /**
     * Standardized method to send push and save to history
     */
    async sendNotification({ recipientId, senderId, type, title, body, data = {} }) {
        console.log(`[NotificationService] Sending ${type} to ${recipientId} from ${senderId}`);

        // 1. Fetch recipient data
        const recipientSnap = await db.collection('users').doc(recipientId).get();
        const recipientData = recipientSnap.data();

        if (!recipientData) {
            console.log(`[NotificationService] Recipient ${recipientId} not found.`);
            return;
        }

        // 🚀 Debounce check
        const isSpam = await this.checkDebounce(recipientId, title, body);
        if (isSpam) {
            console.log(`[NotificationService] Debounce: Spam detected for ${recipientId}`);
            return;
        }

        // 2. Clear old notifications / check debouncing (optional: logic to group later)
        // For now, standardized save to Firestore
        await this.saveToHistory(recipientId, {
            type,
            title,
            body,
            senderUserId: senderId,
            read: false,
            ...data,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // 3. Send Push if enabled and token exists
        if (recipientData.pushNotificationsEnabled === false) {
            console.log(`[NotificationService] Push disabled for ${recipientId}`);
            return;
        }

        const token = recipientData.fcmToken;
        if (!token) {
            console.log(`[NotificationService] No token for ${recipientId}`);
            return;
        }

        try {
            const message = {
                token: token,
                notification: { title, body },
                data: {
                    ...data,
                    type,
                    click_action: 'FLUTTER_NOTIFICATION_CLICK', // standard for some handlers
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
            console.log(`[NotificationService] Push success for ${recipientId}`);
        } catch (error) {
            console.error(`[NotificationService] Push error for ${recipientId}:`, error);
        }
    }

    async saveToHistory(userId, notificationData) {
        return db.collection('notifications')
            .doc(userId)
            .collection('userNotifications')
            .add(notificationData);
    }

    /**
     * Prevent identical notifications within 5 seconds
     */
    async checkDebounce(userId, title, body) {
        const fiveSecondsAgo = new Date(Date.now() - 5000);
        const query = await db.collection('notifications')
            .doc(userId)
            .collection('userNotifications')
            .where('title', '==', title)
            .where('body', '==', body)
            .where('createdAt', '>', fiveSecondsAgo)
            .limit(1)
            .get();
        
        return !query.empty;
    }

    /**
     * Grouping logic for likes
     */
    async handleLikeGrouping(recipientId, senderId, postId, senderName) {
        const recentLikesQuery = await db.collection('notifications')
            .doc(recipientId)
            .collection('userNotifications')
            .where('type', '==', 'like')
            .where('postId', '==', postId)
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get();

        if (!recentLikesQuery.empty) {
            const latestNotif = recentLikesQuery.docs[0];
            const latestData = latestNotif.data();
            
            // If less than 24h old, we could update it instead of adding new
            const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
            if (latestData.createdAt.toMillis() > oneDayAgo) {
                const othersCount = (latestData.othersCount || 0) + 1;
                const newBody = othersCount === 1 
                    ? `${senderName} and 1 other liked your post`
                    : `${senderName} and ${othersCount} others liked your post`;

                await latestNotif.ref.update({
                    body: newBody,
                    othersCount: othersCount,
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                });
                
                // Still send push for the new like
                return this.sendNotification({
                    recipientId,
                    senderId,
                    type: 'like',
                    title: 'New Like! ❤️',
                    body: newBody,
                    data: { postId }
                });
            }
        }

        // Default: first like or old like
        return this.sendNotification({
            recipientId,
            senderId,
            type: 'like',
            title: 'New Like! ❤️',
            body: `${senderName} liked your post`,
            data: { postId }
        });
    }
}

module.exports = new NotificationService();
