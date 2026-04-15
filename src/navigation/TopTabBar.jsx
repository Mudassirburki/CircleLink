import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FeedScreen from '../screens/home/FeedScreen';
import LiveScreen from '../screens/home/LiveScreen';
import ExploreScreen from '../screens/home/ExploreScreen';
import { COLORS } from '../utils/theme';
import { ms } from '../utils/responsive';

const Tab = createMaterialTopTabNavigator();

const TopTabBar = () => {
    return (
        <Tab.Navigator
            screenOptions={{

                tabBarActiveTintColor: COLORS.secondary,
                tabBarInactiveTintColor: COLORS.grey,
                tabBarIndicatorStyle: {
                    backgroundColor: COLORS.secondary,
                    height: 3,
                    borderRadius: 3,

                },
                tabBarLabelStyle: {
                    fontSize: ms(14),
                    fontWeight: 'bold',
                    textTransform: 'none',

                },
                tabBarStyle: {
                    backgroundColor: COLORS.background,
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.border,
                },
                tabBarPressColor: COLORS.transparent,
            }}
        >
            <Tab.Screen name="Feed" component={FeedScreen} />
            <Tab.Screen name="Live" component={LiveScreen} />
            <Tab.Screen name="Explore" component={ExploreScreen} />
        </Tab.Navigator>
    );
};

export default TopTabBar;