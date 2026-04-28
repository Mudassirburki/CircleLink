import React, { useImperativeHandle, forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring, 
    withSequence, 
    withTiming,
    runOnJS
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ms } from '../../utils/responsive';

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

const AnimatedHeart = forwardRef(({ size = ms(80), color = 'white' }, ref) => {
    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);

    useImperativeHandle(ref, () => ({
        play: () => {
            'worklet';
            scale.value = withSequence(
                withSpring(1, { damping: 10, stiffness: 100 }),
                withSpring(1.2),
                withSpring(0)
            );
            opacity.value = withSequence(
                withTiming(1, { duration: 100 }),
                withTiming(1, { duration: 400 }),
                withTiming(0, { duration: 200 })
            );
        }
    }));

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
        position: 'absolute',
        alignSelf: 'center',
        top: '40%',
        zIndex: 10,
    }));

    return (
        <AnimatedIcon 
            name="heart" 
            size={size} 
            color={color} 
            style={animatedStyle} 
        />
    );
});

export default AnimatedHeart;
