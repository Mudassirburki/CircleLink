import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import SignUp from '../screens/auth/SignUpScreen';
import ForgotScreen from '../screens/auth/ForgotScreen';


const Stack = createNativeStackNavigator();
const AppNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="ForgotScreen" component={ForgotScreen} />

        </Stack.Navigator>
    )
}

export default AppNavigator;