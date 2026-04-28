import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring, 
    interpolateColor
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

const LikeButton = ({ isLiked, onPress, size = 22, activeColor = 'red', inactiveColor = '#777' }) => {
    const scale = useSharedValue(1);
    
    useEffect(() => {
        if (isLiked) {
            scale.value = withSpring(1.3, { damping: 10, stiffness: 100 }, () => {
                scale.value = withSpring(1);
            });
        }
    }, [isLiked]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <AnimatedIcon
                name={isLiked ? "heart" : "heart-outline"}
                size={size}
                color={isLiked ? activeColor : inactiveColor}
                style={animatedStyle}
            />
        </TouchableOpacity>
    );
};

export default LikeButton;
