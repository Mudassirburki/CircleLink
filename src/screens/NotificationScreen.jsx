import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import AppText from '../components/common/AppText';
import { useNotifications } from '../hooks/useNotifications';
import { useTheme } from '../context/ThemeContext';
import { ms, vs, s } from '../utils/responsive';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import NotificationService from '../services/notificationService';
import { SafeAreaView } from 'react-native-safe-area-context';

const NotificationScreen = () => {
    const { notifications, loading, refreshing, fetchNotifications, markAsRead, markAllAsRead } = useNotifications();
    const { theme } = useTheme();
    const navigation = useNavigation();

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.notificationItem,
                { borderBottomColor: theme.colors.border },
                !item.read && { backgroundColor: theme.colors.primary + '10' } // Light highlight for unread
            ]}
            onPress={() => {
                if (!item.read) markAsRead(item.id);
                NotificationService.handleNotificationClick(item, navigation);
            }}
        >
            <View style={styles.iconContainer}>
                <View style={[styles.typeIcon, { backgroundColor: item.type === 'like' ? '#FF4B4B' : '#4B7BFF' }]}>
                    <Icon
                        name={item.type === 'like' ? 'heart' : 'person'}
                        size={ms(14)}
                        color="#FFF"
                    />
                </View>
            </View>

            <View style={styles.contentContainer}>
                <AppText.body style={[styles.body, { color: theme.colors.text }]} numberOfLines={2}>
                    {item.body}
                </AppText.body>
                <AppText.body style={[styles.time, { color: theme.colors.subtext }]}>
                    {moment(item.createdAt?.toDate?.() || new Date()).fromNow()}
                </AppText.body>
            </View>

            {!item.read && (
                <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />
            )}
        </TouchableOpacity>
    );

    if (loading && notifications.length === 0) {
        return (
            <View style={[styles.container, styles.center, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                    <AppText.h2 style={{ color: theme.colors.text }}>Notifications</AppText.h2>
                    {notifications.some(n => !n.read) && (
                        <TouchableOpacity onPress={markAllAsRead}>
                            <AppText.body style={{ color: theme.colors.primary, fontWeight: '600' }}>
                                Mark All as Read
                            </AppText.body>
                        </TouchableOpacity>
                    )}
                </View>

                <FlatList
                    data={notifications}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={fetchNotifications}
                            colors={[theme.colors.primary]}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Icon name="notifications-off-outline" size={ms(50)} color={theme.colors.subtext} />
                            <AppText.body style={{ color: theme.colors.subtext, marginTop: vs(10) }}>
                                No notifications yet
                            </AppText.body>
                        </View>
                    }
                    contentContainerStyle={{ paddingBottom: vs(20) }}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingHorizontal: s(20),
        paddingVertical: vs(15),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    notificationItem: {
        flexDirection: 'row',
        padding: s(15),
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    iconContainer: {
        marginRight: s(12),
    },
    typeIcon: {
        width: ms(28),
        height: ms(28),
        borderRadius: ms(14),
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
    },
    body: {
        fontSize: ms(14),
        marginBottom: vs(2),
    },
    time: {
        fontSize: ms(12),
    },
    unreadDot: {
        width: ms(8),
        height: ms(8),
        borderRadius: ms(4),
        marginLeft: s(10),
    },
    emptyContainer: {
        marginTop: vs(100),
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default NotificationScreen;
