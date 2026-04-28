import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native'
import React, { useState } from 'react'
import AppText from '../../components/common/AppText'
import { SafeAreaView } from 'react-native-safe-area-context'
import Input from '../../components/common/Input'
import Button, { SocialButton } from '../../components/common/Button'
import { s, vs, ms } from '../../utils/responsive'
import { useNavigation } from '@react-navigation/native'
import { signUp } from '../../services/AuthService'
import { useTheme } from '../../context/ThemeContext'

const SignUpScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!name || !email || !password) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }
        setLoading(true);
        try {
            await signUp(email, password, name);
        } catch (error) {
            Alert.alert("Sign Up Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <AppText.h1 style={[styles.title, { color: theme.colors.primary }]}>CircleLink</AppText.h1>
                <AppText.body style={[styles.subtitle, { color: theme.colors.subtext }]}>Create your account</AppText.body>
            </View>

            <View style={styles.form}>
                <Input
                    placeholder="Full Name"
                    icon="person-outline"
                    value={name}
                    onChangeText={setName}
                />
                <Input
                    placeholder="Email"
                    icon="mail-outline"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <Input
                    placeholder="Password"
                    icon="lock-closed-outline"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <Button title="Sign Up" onPress={handleSignUp} loading={loading} />
            </View>

            <View style={styles.footer}>
                <AppText.body style={{ color: theme.colors.text }}>Already have an account? </AppText.body>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <AppText.body style={[styles.footerText, { color: theme.colors.primary }]}>Login</AppText.body>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default SignUpScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: s(20),
    },
    header: {
        marginTop: vs(60),
        marginBottom: vs(40),
        alignItems: 'center',
    },
    title: {
        fontSize: ms(32),
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: ms(16),
        marginTop: vs(5),
    },
    form: {
        width: '100%',
        alignItems: 'center',
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E5EA',
    },
    dividerText: {
        marginHorizontal: s(10),
        color: '#999',
    },
    socialContainer: {
        width: '100%',
        alignItems: 'center',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: vs(20),
    },
    footerText: {
        color: '#AF1A5D',
        fontWeight: '600',
    },
})