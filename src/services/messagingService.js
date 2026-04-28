import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import NotificationService from './notificationService';


class MessagingService {
    /**
     * Get and register the device FCM token.
     */
    async getFcmToken() {
        try {
            const token = await messaging().getToken();
            if (token) {
                console.log('[MessagingService] FCM Token fetched:', token);
                await this.saveTokenToFirestore(token);
            }
            return token;
        } catch (error) {
            console.error('[MessagingService] Error getting FCM token:', error);
            return null;
        }
    }

    /**
     * Save token to Firestore under users/{userId} -> fcmToken
     */
    async saveTokenToFirestore(token) {
        const userId = auth().currentUser?.uid;
        if (!userId) {
            console.log('[MessagingService] Token Save Cancelled: No authenticated user.');
            return;
        }

        try {
            await firestore()
                .collection('users')
                .doc(userId)
                .set({
                    fcmToken: token, // Production Field Name
                    lastTokenUpdate: firestore.FieldValue.serverTimestamp()
                }, { merge: true });
            console.log('[MessagingService] Token successfully updated in Firestore.');
        } catch (error) {
            console.error('[MessagingService] Error saving token to Firestore:', error);
        }
    }

    /**
     * Listener for token refresh.
     */
    onTokenRefresh() {
        return messaging().onTokenRefresh(token => {
            console.log('[MessagingService] FCM Token refreshed:', token);
            this.saveTokenToFirestore(token);
        });
    }

    /**
     * Static handler for background messages.
     */
    registerBackgroundHandler() {
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('[MessagingService] Handling message in background:', remoteMessage);
        });
    }

    /**
     * Setup interaction listeners for background/quit states
     */
    setupInteractionListeners(navigation) {
        // 1. App was opened from a quit state
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log('[MessagingService] Init Notification:', remoteMessage);
                    NotificationService.handleNotificationClick(remoteMessage, navigation);
                }
            });

        // 2. App was opened from background state
        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log('[MessagingService] Background Notification:', remoteMessage);
            NotificationService.handleNotificationClick(remoteMessage, navigation);
        });
    }
}


export default new MessagingService();
