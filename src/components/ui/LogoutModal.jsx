import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions,
    ActivityIndicator,
    Pressable,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, RADIUS, SPACING } from '../../utils/theme';
import { s, vs, ms } from '../../utils/responsive';
import AppText from '../common/AppText';

const { width, height } = Dimensions.get('window');

const LogoutModal = ({ isVisible, onClose, onLogout }) => {
    const [loading, setLoading] = useState(false);
    
    // Animation shared values
    const overlayOpacity = useSharedValue(0);
    const modalScale = useSharedValue(0.9);
    const modalOpacity = useSharedValue(0);

    useEffect(() => {
        if (isVisible) {
            overlayOpacity.value = withTiming(1, { duration: 250 });
            modalScale.value = withSpring(1, { damping: 15, stiffness: 150 });
            modalOpacity.value = withTiming(1, { duration: 250 });
        } else {
            overlayOpacity.value = withTiming(0, { duration: 200 });
            modalScale.value = withTiming(0.9, { duration: 200 });
            modalOpacity.value = withTiming(0, { duration: 200 });
        }
    }, [isVisible]);

    const animatedOverlayStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value,
    }));

    const animatedModalStyle = useAnimatedStyle(() => ({
        opacity: modalOpacity.value,
        transform: [{ scale: modalScale.value }],
    }));

    const handleLogout = async () => {
        if (loading) return;
        setLoading(true);
        try {
            await onLogout();
        } catch (error) {
            console.error('Logout Error:', error);
            setLoading(false);
        }
    };

    if (!isVisible && modalOpacity.value === 0) return null;

    return (
        <Modal
            transparent
            visible={isVisible}
            onRequestClose={onClose}
            animationType="none"
        >
            <View style={styles.container}>
                {/* Overlay */}
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
                    <Animated.View style={[styles.overlay, animatedOverlayStyle]} />
                </Pressable>

                {/* Modal Content */}
                <Animated.View style={[styles.modalContent, animatedModalStyle]}>
                    <View style={styles.iconContainer}>
                        <Icon name="log-out-outline" size={ms(30)} color={COLORS.primary} />
                    </View>

                    <AppText.h2 style={styles.title}>Log out?</AppText.h2>
                    <AppText.body style={styles.message}>
                        Are you sure you want to log out of your account?
                    </AppText.body>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                            disabled={loading}
                        >
                            <AppText.body style={styles.cancelText}>Cancel</AppText.body>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.logoutButton]}
                            onPress={handleLogout}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <AppText.body style={styles.logoutText}>Log Out</AppText.body>
                            )}
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        width: width * 0.85,
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.l,
        padding: SPACING.l,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
    },
    iconContainer: {
        width: ms(60),
        height: ms(60),
        borderRadius: ms(30),
        backgroundColor: COLORS.primary + '15', // Transparent primary
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(15),
    },
    title: {
        marginBottom: vs(10),
        textAlign: 'center',
        fontWeight: '700',
    },
    message: {
        textAlign: 'center',
        color: COLORS.subtext,
        marginBottom: vs(25),
        lineHeight: vs(22),
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        gap: s(12),
    },
    button: {
        flex: 1,
        height: vs(50),
        borderRadius: RADIUS.m,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    logoutButton: {
        backgroundColor: COLORS.primary,
    },
    cancelText: {
        color: COLORS.text,
        fontWeight: '600',
    },
    logoutText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});

export default LogoutModal;
