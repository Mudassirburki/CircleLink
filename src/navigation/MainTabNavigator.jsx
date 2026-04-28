import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeNavigator from './HomeNavigator';
import SocialNavigator from './SocialNavigator';
import ProfileNavigator from './ProfileNavigator';
import PostScreen from '../screens/home/PostScreen';
import CusttomBottomTab from '../components/common/CusttomBottomTab';
import NotificationScreen from '../screens/NotificationScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <CusttomBottomTab {...props} />}
            screenOptions={{
                headerShown: false,
                headerTitleAlign: 'center',
            }}
        >
            <Tab.Screen name="Home" component={HomeNavigator} />
            <Tab.Screen name="Explore" component={SocialNavigator} />
            <Tab.Screen name="Post" component={PostScreen} />
            <Tab.Screen name="Notification" component={NotificationScreen} />
            <Tab.Screen name="Profile" component={ProfileNavigator} />
        </Tab.Navigator>
    );
};

export default MainTabNavigator;
