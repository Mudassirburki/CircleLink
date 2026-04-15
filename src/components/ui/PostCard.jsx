import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { s, vs } from "../../utils/responsive";
import { COLORS } from "../../utils/theme";

const formatLikes = (n) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "K";
    return n.toString();
};

const PostCard = ({ post }) => {
    const [liked, setLiked] = useState(post.liked);
    const [saved, setSaved] = useState(post.saved);
    const [likes, setLikes] = useState(post.likes);

    const toggleLike = () => {
        setLiked(!liked);
        setLikes((l) => (liked ? l - 1 : l + 1));
    };

    return (
        <View style={styles.card}>

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <View>
                        <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
                        {post.active && <View style={styles.active} />}
                        <View style={styles.active} />
                        <View style={styles.active} />
                        <View style={styles.active} />

                    </View>

                    <View>
                        <View style={styles.nameRow}>
                            <Text style={styles.name}>{post.user.name}</Text>
                            {post.user.verified && (
                                <Ionicons name="checkmark-circle" size={14} color="#3897f0" />
                            )}
                        </View>
                        <Text style={styles.time}>{post.timeAgo} ago</Text>
                    </View>
                </View>

                <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
            </View>

            {/* Image */}
            {post.image && (

                <TouchableOpacity activeOpacity={0.9} onPress={toggleLike}>
                    <Image source={{ uri: post.image }} style={styles.postImage} />

                </TouchableOpacity>
            )}

            {/* Actions */}
            <View style={styles.actionsContainer}>

                <View style={styles.actionsRow}>
                    <View style={styles.leftActions}>

                        <TouchableOpacity onPress={toggleLike}>
                            <Ionicons
                                name={liked ? "heart" : "heart-outline"}
                                size={22}
                                color={liked ? "red" : "#000"}
                            />
                        </TouchableOpacity>

                        <Ionicons name="chatbubble-outline" size={22} color="#000" />
                        <Ionicons name="paper-plane-outline" size={22} color="#000" />
                    </View>

                    <TouchableOpacity onPress={() => setSaved(!saved)}>
                        <Ionicons
                            name={saved ? "bookmark" : "bookmark-outline"}
                            size={22}
                            color="#000"
                        />
                    </TouchableOpacity>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <Ionicons name="heart" size={14} color="red" />
                    <Text style={styles.boldText}>{formatLikes(likes)}</Text>

                    <Text style={styles.dot}>·</Text>

                    <Ionicons name="chatbubble-outline" size={14} color="#777" />
                    <Text style={styles.lightText}>{post.comments}</Text>

                    <Text style={styles.dot}>·</Text>

                    <Ionicons name="paper-plane-outline" size={14} color="#777" />
                    <Text style={styles.lightText}>{post.shares}</Text>
                </View>

                {/* Caption */}
                <Text style={styles.caption}>
                    <Text style={styles.boldText}>{post.user.username} </Text>
                    {post.caption}
                </Text>

            </View>
        </View>
    );
};

export default PostCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        marginBottom: 12,
        borderRadius: 16,
        overflow: "hidden",
        elevation: 3,
        width: s(350),
        alignSelf: 'center',
        marginTop: vs(10),
    },
    active: {
        position: 'absolute',
        top: 20,
        right: -4,
        width: 10,
        height: 10,
        borderRadius: 25,
        backgroundColor: COLORS.success,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
    },

    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },

    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },

    name: {
        fontSize: 14,
        fontWeight: "600",
    },

    time: {
        fontSize: 12,
        color: "#777",
    },

    postImage: {
        width: "100%",
        height: 250,
        resizeMode: "cover",
    },

    actionsContainer: {
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: 8,
    },

    actionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },

    leftActions: {
        flexDirection: "row",
        gap: 16,
    },

    statsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    boldText: {
        fontWeight: "600",
    },

    lightText: {
        color: "#777",
    },

    dot: {
        marginHorizontal: 4,
        color: "#777",
    },

    caption: {
        marginTop: 6,
        fontSize: 14,
    },
})