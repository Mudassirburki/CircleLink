import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import ExploreScreen from '../screens/home/ExploreScreen';
import NotificationScreen from '../screens/home/NotificationScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import CusttomBottomTab from '../components/common/CusttomBottomTab';
import PostScreen from '../screens/home/PostScreen';




const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <CusttomBottomTab {...props} />}
            screenOptions={{
                headerShown: false,
                headerTitleAlign: 'center',
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Tab.Screen name="Explore" component={ExploreScreen} />
            <Tab.Screen name="Post" component={PostScreen} />
            <Tab.Screen name="Notification" component={NotificationScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;