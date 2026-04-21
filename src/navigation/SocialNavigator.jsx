import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ExploreScreen from '../screens/home/ExploreScreen'; // Or move to social folder later
// import SearchScreen from '../screens/social/SearchScreen';

const Stack = createNativeStackNavigator();

const SocialNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ExploreScreen" component={ExploreScreen} />
            {/* <Stack.Screen name="SearchScreen" component={SearchScreen} /> */}
        </Stack.Navigator>
    );
};

export default SocialNavigator;
