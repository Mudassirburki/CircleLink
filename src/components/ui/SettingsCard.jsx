import { StyleSheet, Switch, Text, View } from 'react-native'
import React, { useState } from 'react'
import { ms } from '../../utils/responsive'
import { COLORS } from '../../utils/theme'
import AppText from '../common/AppText'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native'

import { useTheme } from '../../context/ThemeContext';

const SettingsCard = ({ icon, title, subtitle, type, route, color, value, onValueChange, onPress }) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.left}>
                <View style={[styles.icon, { backgroundColor: theme.colors.background }]}>
                    <Ionicons name={icon} size={24} color={color || theme.colors.text} />
                </View>
                <View style={styles.info}>
                    <AppText.body style={[styles.title, { color: theme.colors.text }]}>{title}</AppText.body>
                    <AppText.body style={[styles.subtitle, { color: theme.colors.subtext }]}>{subtitle}</AppText.body>
                </View>
            </View>
            <View style={styles.right}>
                {type === 'toggle' ? (
                    <Switch
                        trackColor={{ false: '#767577', true: theme.colors.primary }}
                        thumbColor={value ? theme.colors.primary : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={onValueChange}
                        value={value}
                    />
                ) : (
                    <TouchableOpacity onPress={onPress}>
                        <Ionicons name="chevron-forward-outline" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

export default SettingsCard

const styles = StyleSheet.create({
    card: {
        width: ms(343),
        height: ms(100),
        backgroundColor: COLORS.background,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        paddingHorizontal: ms(16),
        paddingVertical: ms(12),
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: ms(12),
        marginBottom: ms(16),
        justifyContent: 'space-between',

    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: ms(40),
        height: ms(40),
        borderRadius: ms(20),
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        marginLeft: ms(16),
    },
    title: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: COLORS.text,
    },
    subtitle: {
        fontSize: ms(12),
        color: COLORS.text,
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
    },
})