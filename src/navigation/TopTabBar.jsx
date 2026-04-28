import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FeedScreen from '../screens/home/FeedScreen';
import LiveScreen from '../screens/home/LiveScreen';
import ExploreScreen from '../screens/home/ExploreScreen';
import { COLORS } from '../utils/theme';
import { ms } from '../utils/responsive';
import { useTheme } from '../context/ThemeContext';

const Tab = createMaterialTopTabNavigator();

const TopTabBar = () => {
    const { theme } = useTheme();
    return (
        <Tab.Navigator
            screenOptions={{

                tabBarActiveTintColor: theme.colors.secondary,
                tabBarInactiveTintColor: theme.colors.grey,
                tabBarIndicatorStyle: {
                    backgroundColor: theme.colors.secondary,
                    height: 3,
                    borderRadius: 3,


                },
                tabBarLabelStyle: {
                    fontSize: ms(14),
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
                tabBarPressColor: theme.colors.transparent,
            }}
        >
            <Tab.Screen name="Feed" component={FeedScreen} />
            <Tab.Screen name="Live" component={LiveScreen} />
            <Tab.Screen name="Explore" component={ExploreScreen} />

        </Tab.Navigator>
    );
};

export default TopTabBar;