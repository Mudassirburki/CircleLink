import { StyleSheet, View } from 'react-native'
import React from 'react'
import AppText from '../../components/common/AppText'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ms, s, vs } from '../../utils/responsive'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const ForgotScreen = () => {
    const navigation = useNavigation()
    return (
        <SafeAreaView style={styles.container}>
            <AppText.h1 style={styles.title}>CircleLink</AppText.h1>
            <View style={styles.form}>
                <View style={styles.iconContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#AF1A5D" style={styles.icon} />
                </View>
                <AppText.h1 style={styles.ResetText}> Reset Passward</AppText.h1>
                <AppText.body style={styles.bodyText}>No worries , it happen to the best of us. Enter your email address and we'll send you a link to reset it.</AppText.body>
                <AppText.h3 style={styles.emailText}>Email Address</AppText.h3>
                <Input placeholder="name@example.com" icon="mail-outline" />
                <Button title="Send Link" onPress={() => { }} />
                <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                    <View style={styles.footer}>
                        <Ionicons name="arrow-back-outline" size={20} color="#000" style={styles.icon} />
                        <AppText.body style={styles.footerText}> Back to Login</AppText.body>
                    </View>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

export default ForgotScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: ms(32),
        fontWeight: 'bold',
        color: '#AF1A5D',
        marginTop: vs(30),
    },
    iconContainer: {
        width: s(50),
        backgroundColor: '#FFD9E1',
        height: vs(50),
        marginTop: vs(20),
        borderRadius: s(50),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: "flex-start"
    },
    form: {
        width: '90%',
        height: vs(500),
        backgroundColor: '#fff',
        borderRadius: s(15),
        marginTop: vs(30),
        paddingHorizontal: s(20),
        paddingVertical: vs(20),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    ResetText: {
        fontSize: ms(30),
        fontWeight: 'bold',
        color: '#000',
        marginTop: vs(20),
        marginBottom: vs(20),
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',

    },
    bodyText: {
        fontSize: ms(16),
        fontWeight: '400',
        textAlign: 'justify'
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: vs(20),
    },
    footerText: {
        color: '#000',
        fontWeight: '600',
        // marginTop: vs(20),
        alignSelf: 'center',
    },
    emailText: {
        marginTop: vs(20),
        marginBottom: vs(5),
        fontWeight: 'bold',
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
    },
    icon: {

    }
})