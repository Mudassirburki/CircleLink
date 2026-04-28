import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import Settings from '../screens/settings/Settings';
import auth from '@react-native-firebase/auth';
import EditProfile from '../screens/profile/EditProfile';

import SplashScreen from '../screens/SplashScreen';
import useNotifications from '../hooks/useNotifications';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    useNotifications();
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);
    const [splashComplete, setSplashComplete] = useState(false);

    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    // Show splash until BOTH auth is initialized and animation is complete
    if (initializing || !splashComplete) {
        return <SplashScreen onAnimationComplete={() => setSplashComplete(true)} />;
    }

    return (
        <Stack.Navigator 
            screenOptions={{ 
                headerShown: false,
                animation: 'fade' // Smooth transition between screens
            }}
        >
            {user ? (
                <>
                    <Stack.Screen name="MainTabs" component={MainTabNavigator} />
                    <Stack.Screen name="Settings" component={Settings} />
                    <Stack.Screen name="EditProfile" component={EditProfile} />
                </>
            ) : (
                <Stack.Screen name="Auth" component={AuthNavigator} />
            )}
        </Stack.Navigator>
    );
};

export default RootNavigator;