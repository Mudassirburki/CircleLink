import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS, SPACING } from '../../utils/theme';
import { ms, vs } from '../../utils/responsive';
import Icon from 'react-native-vector-icons/Ionicons';
import AppText from './AppText';

// Brand Theme Colors
const BRAND_PRIMARY = COLORS.primary;
const INACTIVE_COLOR = COLORS.subtext;
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? vs(90) : vs(70);

const AnimatedAppText = Animated.createAnimatedComponent(AppText.body);

/**
 * Individual Tab Item Component
 */
const TabItem = React.memo(({ route, isFocused, onPress, label }) => {
    const animation = useSharedValue(isFocused ? 1 : 0);

    React.useEffect(() => {
        animation.value = withSpring(isFocused ? 1 : 0, {
            damping: 15,
            stiffness: 150,
        });
    }, [isFocused]);

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: withTiming(isFocused ? 1.1 : 1, {
                        duration: 200,
                        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
                    })
                }
            ],
            opacity: withTiming(isFocused ? 1 : 0.8, { duration: 200 }),
        };
    });

    const getIcon = (name, focused) => {
        switch (name) {
            case 'Home':
                return focused ? 'home' : 'home-outline';
            case 'Explore':
                return focused ? 'search' : 'search-outline';
            case 'Post':
                return focused ? 'add' : 'add-outline';
            case 'Notification':
                return focused ? 'notifications' : 'notifications-outline';
            case 'Profile':
                return focused ? 'person' : 'person-outline';
            default:
                return 'help-outline';
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            style={styles.tabItem}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
        >
            <View style={styles.contentContainer}>
                <Animated.View style={animatedIconStyle}>
                    <Icon
                        name={getIcon(route.name, isFocused)}
                        size={ms(24)}
                        color={isFocused ? BRAND_PRIMARY : INACTIVE_COLOR}
                    />
                </Animated.View>
                <AppText.body
                    style={[
                        styles.label,
                        {
                            color: isFocused ? BRAND_PRIMARY : INACTIVE_COLOR,
                            fontWeight: isFocused ? '700' : '400'
                        }
                    ]}
                >
                    {label}
                </AppText.body>
            </View>
        </TouchableOpacity>
    );
});

/**
 * Custom Tab Bar Component
 */
const CustomTabBar = ({ state, descriptors, navigation }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[
            styles.container,
            {
                height: TAB_BAR_HEIGHT + insets.bottom,
                paddingBottom: insets.bottom
            }
        ]}>
            <View style={styles.tabWrapper}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const label = options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                    const handlePress = useCallback(() => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    }, [isFocused, route.key, route.name, navigation]);

                    return (
                        <TabItem
                            key={route.key}
                            route={route}
                            label={label}
                            isFocused={isFocused}
                            onPress={handlePress}
                        />
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: RADIUS.xl,
        borderTopRightRadius: RADIUS.xl,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -10 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
            },
            android: {
                elevation: 20,
            },
        }),
        position: 'absolute',
        bottom: -15,
        left: 0,
        right: 0,
        borderTopWidth: Platform.OS === 'ios' ? 0 : 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    tabWrapper: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    tabItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',

    },
    label: {
        fontSize: ms(12),
        marginTop: vs(4),
    },
});

export default CustomTabBar;