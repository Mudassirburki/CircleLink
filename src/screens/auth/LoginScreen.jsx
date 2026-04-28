import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native'
import React, { useState } from 'react'
import AppText from '../../components/common/AppText'
import { SafeAreaView } from 'react-native-safe-area-context'
import Input from '../../components/common/Input'
import Button, { SocialButton } from '../../components/common/Button'
import { s, vs, ms } from '../../utils/responsive'
import { useNavigation } from '@react-navigation/native'
import { signIn } from '../../services/AuthService'


import { useTheme } from '../../context/ThemeContext'

const LoginScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            await signIn(email, password);
        } catch (error) {
            Alert.alert("Login Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <AppText.h1 style={[styles.title, { color: theme.colors.primary }]}>CircleLink</AppText.h1>
                <AppText.body style={[styles.subtitle, { color: theme.colors.subtext }]}>Welcome Back</AppText.body>
            </View>

            <View style={styles.form}>
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

                <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotScreen')}>
                    <AppText.small style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>Forgot Password?</AppText.small>
                </TouchableOpacity>

                <Button title="Login" onPress={handleLogin} loading={loading} />
            </View>

            <View style={styles.dividerContainer}>
                <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                <AppText.small style={[styles.dividerText, { color: theme.colors.subtext }]}>Or Continue with</AppText.small>
                <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            </View>

            <View style={styles.socialContainer}>
                <SocialButton
                    title="Continue with Google"
                    iconType="google"
                    onPress={() => { }}
                />
            </View>
            <View style={styles.footer}>
                <AppText.body style={{ color: theme.colors.text }}>Don't have an account? </AppText.body>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <AppText.body style={[styles.footerText, { color: theme.colors.primary }]}>Sign Up</AppText.body>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default LoginScreen

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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginRight: '5%',
        marginBottom: vs(20),
    },
    forgotPasswordText: {
        fontWeight: '600',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: vs(30),
        width: '90%',
    },
    divider: {
        flex: 1,
        height: 1.5,
    },
    dividerText: {
        marginHorizontal: s(10),
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
        fontWeight: '600',
    },
})