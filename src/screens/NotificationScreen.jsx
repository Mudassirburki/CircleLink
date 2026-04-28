import React, { useState, useEffect } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING } from '../utils/theme';
import AppText from '../components/common/AppText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ms } from '../utils/responsive';
import notificationHistoryService from '../services/notificationHistoryService';
import { useTheme } from '../context/ThemeContext';

const NotificationScreen = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    const userId = auth().currentUser?.uid;
    const { theme } = useTheme();

    useEffect(() => {
        if (!userId) return;

        console.log('[NotificationScreen] Initializing real-time listener.');
        const unsubscribe = notificationHistoryService.onNotificationsUpdate((data) => {
            setNotifications(data);
            setLoading(false);
        });

        return () => unsubscribe && unsubscribe();
    }, [userId]);

    const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 800);
    };

    const handleNotificationClick = async (item) => {
        try {
            await notificationHistoryService.markAsRead(item.id);
        } catch (error) {
            console.error('[NotificationScreen] Error marking read:', error);
        }

        if (item.type === 'like' || item.type === 'comment') {
            if (item.postId) navigation.navigate('PostDetail', { postId: item.postId });
        } else if (item.type === 'follow') {
            if (item.userId) navigation.navigate('Profile', { userId: item.userId });
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'like': return { name: 'heart', color: '#FF3040' };
            case 'comment': return { name: 'chatbubble', color: '#1A73E8' };
            case 'follow': return { name: 'person-add', color: '#10B981' };
            default: return { name: 'notifications', color: theme.colors.primary };
        }
    };

    const renderItem = ({ item }) => {
        const icon = getIcon(item.type);
        const timeAgo = item.createdAt ? new Date(item.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

        return (
            <TouchableOpacity 
                style={[styles.itemContainer, !item.read && { backgroundColor: theme.colors.primary + '08' }]}
                onPress={() => handleNotificationClick(item)}
            >
                <View style={[styles.iconWrapper, { backgroundColor: icon.color + '15' }]}>
                    <Ionicons name={icon.name} size={ms(18)} color={icon.color} />
                </View>
                
                <View style={styles.content}>
                    <AppText.body style={[styles.message, { color: theme.colors.text }]}>
                        <AppText.body style={[styles.boldText, { color: theme.colors.text }]}>{item.title}</AppText.body> {item.body}
                    </AppText.body>
                    <AppText.body style={[styles.time, { color: theme.colors.subtext }]}>{timeAgo}</AppText.body>
                </View>

                {!item.read && <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />}
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                <AppText.h2 style={[styles.headerTitle, { color: theme.colors.text }]}>Activity</AppText.h2>
            </View>

            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} tintColor={theme.colors.primary} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="notifications-outline" size={ms(60)} color={theme.colors.border} />
                        <AppText.body style={[styles.emptyText, { color: theme.colors.subtext }]}>No activity yet.</AppText.body>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        borderBottomWidth: 0.5,
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: ms(22),
    },
    listContent: {
        paddingBottom: ms(20),
    },
    itemContainer: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.m,
        paddingVertical: ms(16),
        alignItems: 'center',
    },
    iconWrapper: {
        width: ms(44),
        height: ms(44),
        borderRadius: ms(22),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    content: {
        flex: 1,
    },
    message: {
        fontSize: ms(14),
        lineHeight: ms(20),
    },
    boldText: {
        fontWeight: 'bold',
    },
    time: {
        fontSize: ms(12),
        marginTop: ms(2),
    },
    unreadDot: {
        width: ms(8),
        height: ms(8),
        borderRadius: ms(4),
        marginLeft: SPACING.s,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        marginTop: ms(120),
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
    },
    emptyText: {
        marginTop: SPACING.m,
        fontSize: ms(16),
    }
});

export default NotificationScreen;
