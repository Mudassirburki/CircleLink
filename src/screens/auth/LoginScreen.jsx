import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native'
import React, { useState } from 'react'
import AppText from '../../components/common/AppText'
import { SafeAreaView } from 'react-native-safe-area-context'
import Input from '../../components/common/Input'
import Button, { SocialButton } from '../../components/common/Button'
import { s, vs, ms } from '../../utils/responsive'
import { useNavigation } from '@react-navigation/native'
import { signIn } from '../../services/AuthService'


const LoginScreen = () => {
    const navigation = useNavigation();
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
            // navigation.navigate('MainTabs'); // Handled by RootNavigator
        } catch (error) {
            Alert.alert("Login Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AppText.h1 style={styles.title}>CircleLink</AppText.h1>
                <AppText.body style={styles.subtitle}>Welcome Back</AppText.body>
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
                    <AppText.small style={styles.forgotPasswordText}>Forgot Password?</AppText.small>
                </TouchableOpacity>

                <Button title="Login" onPress={handleLogin} loading={loading} />
            </View>

            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <AppText.small style={styles.dividerText}>Or Continue with</AppText.small>
                <View style={styles.divider} />
            </View>

            <View style={styles.socialContainer}>
                <SocialButton
                    title="Continue with Google"
                    iconType="google"
                    onPress={() => { }}
                />
            </View>
            <View style={styles.footer}>
                <AppText.body>Don't have an account? </AppText.body>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <AppText.body style={styles.footerText}>Sign Up</AppText.body>
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
        backgroundColor: '#fff',
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
        color: '#AF1A5D',
    },
    subtitle: {
        fontSize: ms(16),
        color: '#666',
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
        color: '#AF1A5D',
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