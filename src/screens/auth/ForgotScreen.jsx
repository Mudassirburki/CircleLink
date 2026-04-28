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
import { useTheme } from '../../context/ThemeContext'

const ForgotScreen = () => {
    const navigation = useNavigation()
    const { theme } = useTheme()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const handleReset = async () => {
        if (!email) {
            Alert.alert("Error", "Please enter your email")
            return
        }

        setLoading(true)
        try {
            // await passwordReset(email)
            Alert.alert("Success", "Password reset email sent!")
            navigation.goBack()
        } catch (error) {
            Alert.alert("Error", error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <AppText.h2 style={[styles.title, { color: theme.colors.primary }]}>Reset Password</AppText.h2>
            </View>

            <View style={styles.content}>
                <AppText.body style={[styles.description, { color: theme.colors.subtext }]}>
                    Enter your email address and we'll send you a link to reset your password.
                </AppText.body>

                <Input
                    placeholder="Email"
                    icon="mail-outline"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Button title="Send Link" onPress={handleReset} loading={loading} />
            </View>
        </SafeAreaView>
    )
}

export default ForgotScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: s(20),
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