import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppText from '../../components/common/AppText'
import { ms } from '../../utils/responsive'
import NotificationCard from '../../components/ui/NotificationCard'
import { notificationData } from '../../dummyData/Data'

const NotificationScreen = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <AppText.body>Notification</AppText.body>
                <FlatList
                    data={notificationData}
                    renderItem={({ item }) => <NotificationCard item={item} />}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>
        </SafeAreaView>
    )
}

export default NotificationScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: ms(20),
    },
})