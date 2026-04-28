import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

class NotificationHistoryService {
    /**
     * Fetch notifications for the current user.
     * @param {number} limit - Number of notifications to fetch.
     */
    async getNotifications(limit = 20) {
        const userId = auth().currentUser?.uid;
        if (!userId) return [];

        try {
            const snapshot = await firestore()
                .collection('users')
                .doc(userId)
                .collection('notifications')
                .orderBy('createdAt', 'desc')
                .limit(limit)
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching notification history:', error);
            return [];
        }
    }

    /**
     * Mark a notification as read.
     * @param {string} notificationId - The ID of the notification.
     */
    async markAsRead(notificationId) {
        const userId = auth().currentUser?.uid;
        if (!userId) return;

        try {
            await firestore()
                .collection('users')
                .doc(userId)
                .collection('notifications')
                .doc(notificationId)
                .update({ read: true });
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }

    /**
     * Real-time listener for new notifications.
     * @param {function} callback - Function called with the updated notifications list.
     */
    onNotificationsUpdate(callback) {
        const userId = auth().currentUser?.uid;
        if (!userId) return () => {};

        return firestore()
            .collection('users')
            .doc(userId)
            .collection('notifications')
            .orderBy('createdAt', 'desc')
            .limit(50)
            .onSnapshot(snapshot => {
                const notifications = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(notifications);
            }, error => {
                console.error('Notification snapshot error:', error);
            });
    }
}

export default new NotificationHistoryService();
