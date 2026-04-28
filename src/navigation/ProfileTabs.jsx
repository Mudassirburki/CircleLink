import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import UserPosts from '../screens/profile/tabs/UserPosts';
import LikedPosts from '../screens/profile/tabs/LikedPosts';
import SavedPosts from '../screens/profile/tabs/SavedPosts';
import { COLORS } from '../utils/theme';
import { ms } from '../utils/responsive';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';

const Tab = createMaterialTopTabNavigator();

const ProfileTabs = ({ userId }) => {
    const { theme } = useTheme();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: theme.colors.secondary,
                tabBarInactiveTintColor: theme.colors.grey,
                tabBarIndicatorStyle: {
                    backgroundColor: COLORS.secondary,
                    height: 3,
                    borderRadius: 3,
                },
                tabBarLabelStyle: {
                    fontSize: ms(12),
                    fontWeight: 'bold',
                    textTransform: 'none',
                },
                tabBarStyle: {
                    backgroundColor: theme.colors.background,
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.border,
                },
                tabBarIcon: ({ color, focused }) => {
                    let iconName;
                    if (route.name === 'Posts') {
                        iconName = focused ? 'grid' : 'grid-outline';
                    } else if (route.name === 'Liked') {
                        iconName = focused ? 'heart' : 'heart-outline';
                    } else if (route.name === 'Saved') {
                        iconName = focused ? 'bookmark' : 'bookmark-outline';
                    }
                    return <Ionicons name={iconName} size={20} color={color} />;
                },
                tabBarShowIcon: true,
                tabBarShowLabel: false,
            })}
        >
            <Tab.Screen name="Posts" component={UserPosts} initialParams={{ userId }} />
            <Tab.Screen name="Liked" component={LikedPosts} initialParams={{ userId }} />
            <Tab.Screen name="Saved" component={SavedPosts} initialParams={{ userId }} />
        </Tab.Navigator>
    );
};

export default ProfileTabs;
