import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import messagingService from '../services/messagingService';
import notificationService from '../services/notificationService';
import { useNavigation } from '@react-navigation/native';
import notifee, { EventType } from '@notifee/react-native';

const useNotifications = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const initialize = async () => {
            const hasPermission = await notificationService.requestPermission();
            if (hasPermission) {
                await messagingService.getFcmToken();
                messagingService.onTokenRefresh();
            }
        };

        initialize();

        // Foreground messages
        const unsubscribeMessaging = messaging().onMessage(async remoteMessage => {
            console.log('FCM Foreground Message:', remoteMessage);
            await notificationService.displayNotification(remoteMessage);
        });

        // Background/Quit state clicks (FCM)
        const unsubscribeOpenedApp = messaging().onNotificationOpenedApp(remoteMessage => {
            notificationService.handleNotificationClick(remoteMessage, navigation);
        });

        // Initial notification (Quit state)
        messaging().getInitialNotification().then(remoteMessage => {
            if (remoteMessage) {
                notificationService.handleNotificationClick(remoteMessage, navigation);
            }
        });

        // Notifee clicks (Foreground)
        const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
            if (type === EventType.PRESS) {
                notificationService.handleNotificationClick(detail, navigation);
            }
        });

        return () => {
            unsubscribeMessaging();
            unsubscribeOpenedApp();
            unsubscribeNotifee();
        };
    }, [navigation]);
};

export default useNotifications;
