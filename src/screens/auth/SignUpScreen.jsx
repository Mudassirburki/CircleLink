import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native'
import React, { useState } from 'react'
import AppText from '../../components/common/AppText'
import { SafeAreaView } from 'react-native-safe-area-context'
import Input from '../../components/common/Input'
import Button, { SocialButton } from '../../components/common/Button'
import { s, vs, ms } from '../../utils/responsive'
import { useNavigation } from '@react-navigation/native'
import { signUp, signIn } from '../../services/AuthService'

const SignUp = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            await signUp(email, password);
            // navigation.navigate('MainTabs'); // Handled by RootNavigator
        } catch (error) {
            Alert.alert("Login Failed", error.message);
        } finally {
            setLoading(false);
        }
    };
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AppText.h1 style={styles.title}>CircleLink</AppText.h1>
                <AppText.h2 style={styles.subtitle}>Create Account</AppText.h2>
                <AppText.small style={styles.subtitle}>Please enter your details to create an account</AppText.small>
            </View>

            <View style={styles.form}>
                <Input value={name} onChangeText={setName} placeholder="Name" icon="person-outline" />
                <Input value={email} onChangeText={setEmail} placeholder="Email" icon="mail-outline" />
                <Input value={password} onChangeText={setPassword} placeholder="Password" icon="lock-closed-outline" secureTextEntry />



                <Button title="Sign Up" onPress={handleSignUp} />
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
                <AppText.body>Already have an account? </AppText.body>
                <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                    <AppText.body style={styles.footerText}>Login</AppText.body>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default SignUp

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