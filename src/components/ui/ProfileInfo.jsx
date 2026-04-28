import { StyleSheet, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { ms } from "../../utils/responsive";
import AppText from "../common/AppText";

const StatsRow = ({ posts = 0, followers = 0, following = 0 }) => {
    return (
        <View style={styles.row}>
            <StatItem label="Posts" value={posts} />
            <StatItem label="Followers" value={followers} />
            <StatItem label="Following" value={following} />
        </View>
    );
}

const StatItem = ({ label, value }) => {
    const { theme } = useTheme();
    return (
        <View style={styles.statItem}>
            <AppText.body style={styles.statValue}>{value}</AppText.body>
            <AppText.body style={[styles.statLabel, { color: theme.colors.subtext }]}>{label}</AppText.body>
        </View>
    )
}

export default StatsRow;

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1,
        marginLeft: ms(20),
    },
    statItem: {
        alignItems: "center",
    },
    statValue: {
        fontSize: ms(18),
        fontWeight: "bold",
    },
    statLabel: {
        fontSize: ms(14),
    }
})