import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { Platform, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';

class NotificationService {
    async requestPermission() {
        if (Platform.OS === 'android' && Platform.Version >= 33) {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }

        const authStatus = await messaging().requestPermission();
        return (
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL
        );
    }

    async displayNotification(remoteMessage) {
        const { notification, data } = remoteMessage;

        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            importance: AndroidImportance.HIGH,
        });

        await notifee.displayNotification({
            title: notification.title,
            body: notification.body,
            data: data,
            android: {
                channelId,
                importance: AndroidImportance.HIGH,
                pressAction: {
                    id: 'default',
                },
                smallIcon: 'ic_launcher',
                color: '#AF1A5D',
            },
        });
    }

    async handleNotificationClick(remoteMessage, navigation) {
        const data = remoteMessage.notification ? remoteMessage.notification.data : remoteMessage.data;
        const { type, postId, userId } = data || {};

        if (!navigation) return;

        switch (type) {
            case 'like':
            case 'comment':
                if (postId) navigation.navigate('PostDetail', { postId });
                break;
            case 'follow':
                if (userId) navigation.navigate('Profile', { userId });
                break;
            default:
                console.log('Unknown notification type:', type);
        }
    }
}

export default new NotificationService();
