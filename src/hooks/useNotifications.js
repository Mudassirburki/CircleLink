import { useState, useEffect, useCallback } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const currentUser = auth().currentUser;

    const fetchNotifications = useCallback(async () => {
        if (!currentUser) return;

        try {
            setRefreshing(true);
            const snapshot = await firestore()
                .collection('notifications')
                .doc(currentUser.uid)
                .collection('userNotifications')
                .orderBy('createdAt', 'desc')
                .get();

            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            setNotifications(data);
        } catch (error) {
            console.error('[useNotifications] Error fetching:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [currentUser]);

    // Real-time listener for history and badges
    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = firestore()
            .collection('notifications')
            .doc(currentUser.uid)
            .collection('userNotifications')
            .orderBy('createdAt', 'desc')
            .onSnapshot(snapshot => {
                if (snapshot) {
                    const data = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setNotifications(data);
                    
                    // Update unread count
                    const unread = data.filter(n => n.read === false).length;
                    setUnreadCount(unread);
                    setLoading(false);
                }
            }, error => {
                console.error('[useNotifications] Snapshot error:', error);
            });

        return () => unsubscribe();
    }, [currentUser]);

    const markAsRead = async (notificationId) => {
        if (!currentUser) return;

        try {
            await firestore()
                .collection('notifications')
                .doc(currentUser.uid)
                .collection('userNotifications')
                .doc(notificationId)
                .update({ read: true });
        } catch (error) {
            console.error('[useNotifications] Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        if (!currentUser) return;

        try {
            const batch = firestore().batch();
            const unreadNotifs = notifications.filter(n => !n.read);
            
            unreadNotifs.forEach(n => {
                const ref = firestore()
                    .collection('notifications')
                    .doc(currentUser.uid)
                    .collection('userNotifications')
                    .doc(n.id);
                batch.update(ref, { read: true });
            });

            await batch.commit();
        } catch (error) {
            console.error('[useNotifications] Error marking all read:', error);
        }
    };

    return {
        notifications,
        unreadCount,
        loading,
        refreshing,
        fetchNotifications,
        markAsRead,
        markAllAsRead
    };
};
