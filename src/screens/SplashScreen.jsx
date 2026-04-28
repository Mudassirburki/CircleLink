import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, StatusBar } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    withSequence,
    withDelay,
    Easing,
    interpolate,
} from 'react-native-reanimated';
import { COLORS } from '../utils/theme';
import { s, vs, ms } from '../utils/responsive';
import AppText from '../components/common/AppText';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onAnimationComplete }) => {
    // Animation shared values
    const backgroundOpacity = useSharedValue(0);
    const logoScale = useSharedValue(0.8);
    const logoOpacity = useSharedValue(0);
    const logoPulse = useSharedValue(1);
    const titleOpacity = useSharedValue(0);
    const titleTranslateY = useSharedValue(20);
    const loaderOpacity = useSharedValue(0);

    useEffect(() => {
        // Start animations
        backgroundOpacity.value = withTiming(1, { duration: 1000 });
        
        logoOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
        logoScale.value = withDelay(300, withTiming(1.05, { 
            duration: 1200, 
            easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
        }));

        // Pulse effect
        logoPulse.value = withDelay(1500, withRepeat(
            withSequence(
                withTiming(1.1, { duration: 1000 }),
                withTiming(1, { duration: 1000 })
            ),
            -1,
            true
        ));

        // Title animation
        titleOpacity.value = withDelay(1000, withTiming(1, { duration: 800 }));
        titleTranslateY.value = withDelay(1000, withTiming(0, { 
            duration: 800, 
            easing: Easing.out(Easing.exp) 
        }));

        // Loader animation
        loaderOpacity.value = withDelay(1800, withTiming(1, { duration: 500 }));

        // Completion trigger (2.5s - 3s)
        const timeout = setTimeout(() => {
            if (onAnimationComplete) onAnimationComplete();
        }, 3000);

        return () => clearTimeout(timeout);
    }, []);

    const animatedBackgroundStyle = useAnimatedStyle(() => ({
        opacity: backgroundOpacity.value,
    }));

    const animatedLogoStyle = useAnimatedStyle(() => ({
        opacity: logoOpacity.value,
        transform: [
            { scale: logoScale.value * logoPulse.value }
        ],
    }));

    const animatedTitleStyle = useAnimatedStyle(() => ({
        opacity: titleOpacity.value,
        transform: [{ translateY: titleTranslateY.value }],
    }));

    const animatedLoaderStyle = useAnimatedStyle(() => ({
        opacity: loaderOpacity.value,
    }));

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            
            <Animated.View style={[styles.background, animatedBackgroundStyle]} />

            <View style={styles.content}>
                {/* Logo Section */}
                <Animated.View style={[styles.logoContainer, animatedLogoStyle]}>
                    <View style={styles.iconCircle}>
                        <Icon name="link" size={ms(60)} color="#FFFFFF" />
                        <View style={styles.dot} />
                    </View>
                </Animated.View>

                {/* Title Section */}
                <Animated.View style={[styles.titleContainer, animatedTitleStyle]}>
                    <AppText.h1 style={styles.title}>CircleLink</AppText.h1>
                    <AppText.body style={styles.subtitle}>Connecting Worlds</AppText.body>
                </Animated.View>
            </View>

            {/* Footer / Loader */}
            <Animated.View style={[styles.footer, animatedLoaderStyle]}>
                <View style={styles.loaderBar}>
                    <AnimatedDot delay={0} />
                    <AnimatedDot delay={200} />
                    <AnimatedDot delay={400} />
                </View>
            </Animated.View>
        </View>
    );
};

const AnimatedDot = ({ delay }) => {
    const dotScale = useSharedValue(0.4);
    const dotOpacity = useSharedValue(0.4);

    useEffect(() => {
        dotScale.value = withDelay(delay, withRepeat(
            withSequence(
                withTiming(1, { duration: 600 }),
                withTiming(0.4, { duration: 600 })
            ),
            -1,
            true
        ));
        dotOpacity.value = withDelay(delay, withRepeat(
            withSequence(
                withTiming(1, { duration: 600 }),
                withTiming(0.4, { duration: 600 })
            ),
            -1,
            true
        ));
    }, []);

    const animatedDotStyle = useAnimatedStyle(() => ({
        transform: [{ scale: dotScale.value }],
        opacity: dotOpacity.value,
    }));

    return <Animated.View style={[styles.dotSmall, animatedDotStyle]} />;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A', // Dark background
        alignItems: 'center',
        justifyContent: 'center',
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.primary, // #AF1A5D
        opacity: 0.1, // Will be overlaid on dark
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        width: ms(120),
        height: ms(120),
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircle: {
        width: ms(100),
        height: ms(100),
        borderRadius: ms(50),
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
    },
    dot: {
        position: 'absolute',
        bottom: ms(15),
        right: ms(15),
        width: ms(12),
        height: ms(12),
        borderRadius: ms(6),
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    titleContainer: {
        marginTop: vs(20),
        alignItems: 'center',
    },
    title: {
        color: '#FFFFFF',
        fontSize: ms(32),
        fontWeight: '800',
        letterSpacing: 1,
    },
    subtitle: {
        color: '#CBD5E1',
        fontSize: ms(16),
        marginTop: vs(5),
        opacity: 0.8,
    },
    footer: {
        position: 'absolute',
        bottom: vs(60),
        alignItems: 'center',
    },
    loaderBar: {
        flexDirection: 'row',
        gap: s(8),
    },
    dotSmall: {
        width: s(8),
        height: s(8),
        borderRadius: s(4),
        backgroundColor: '#FFFFFF',
    },
});

export default SplashScreen;
