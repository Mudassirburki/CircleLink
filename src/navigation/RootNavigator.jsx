import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import Settings from '../screens/settings/Settings';
import auth from '@react-native-firebase/auth';
import EditProfile from '../screens/profile/EditProfile';

import SplashScreen from '../screens/SplashScreen';
import { useNotifications } from '../hooks/useNotifications';
import messagingService from '../services/messagingService';
import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    const { unreadCount } = useNotifications(); // Keeps real-time listener active
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);
    const [splashComplete, setSplashComplete] = useState(false);
    
    // We can't use useNavigation here inside the navigator itself easily 
    // but the setupInteractionListeners might need a navigation ref or be called inside a component that has it.

    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; 
    }, []);

    // Show splash until BOTH auth is initialized and animation is complete
    if (initializing || !splashComplete) {
        return <SplashScreen onAnimationComplete={() => setSplashComplete(true)} />;
    }

    return (
        <Stack.Navigator 
            screenOptions={{ 
                headerShown: false,
                animation: 'fade' 
            }}
        >
            {user ? (
                <>
                    <Stack.Screen name="MainTabs" component={MainTabsWrapper} />
                    <Stack.Screen name="Settings" component={Settings} />
                    <Stack.Screen name="EditProfile" component={EditProfile} />
                </>
            ) : (
                <Stack.Screen name="Auth" component={AuthNavigator} />
            )}
        </Stack.Navigator>
    );
};

/**
 * Wrapper to get navigation prop for messaging listeners
 */
const MainTabsWrapper = ({ navigation }) => {
    useEffect(() => {
        messagingService.setupInteractionListeners(navigation);
    }, [navigation]);

    return <MainTabNavigator />;
};

export default RootNavigator;