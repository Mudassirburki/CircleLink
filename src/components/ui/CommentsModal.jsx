import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Modal, FlatList, Image, TextInput, StyleSheet } from 'react-native';
import Animated, { FadeIn, SlideInDown, FadeOut } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppText from '../common/AppText';
import { useTheme } from '../../context/ThemeContext';

import { ms, s, vs } from '../../utils/responsive';
import { getComments, addComment } from '../../services/PostService';


const CommentsModal = ({ visible, onClose, postId }) => {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        if (visible && postId) {
            const unsubscribe = getComments(postId, (data) => {
                setComments(data);
            });
            return () => unsubscribe();
        }
    }, [visible, postId]);

    const handleSend = async () => {
        if (!text.trim()) return;
        setLoading(true);
        try {
            await addComment(postId, text);
            setText('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="none" transparent>
            <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>
                <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
                <Animated.View
                    entering={SlideInDown.springify().damping(15)}
                    style={[styles.content, { backgroundColor: theme.colors.surface }]}
                >
                    <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                        <AppText.body style={[styles.title, { color: theme.colors.text }]}>Comments</AppText.body>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={comments}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.commentItem}>
                                <Image
                                    source={item.userImage ? { uri: item.userImage } : require('../../assets/Mb.jpeg')}
                                    style={styles.avatar}
                                />
                                <View style={styles.commentContent}>
                                    <AppText.body style={[styles.username, { color: theme.colors.text }]}>{item.username}</AppText.body>
                                    <AppText.body style={[styles.text, { color: theme.colors.text }]}>{item.text}</AppText.body>
                                </View>
                            </View>
                        )}
                        contentContainerStyle={styles.list}
                        ListEmptyComponent={() => (
                            <AppText.body style={[styles.empty, { color: theme.colors.subtext }]}>No comments yet.</AppText.body>
                        )}
                    />

                    <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.colors.background, color: theme.colors.text }]}
                            placeholder="Add a comment..."
                            placeholderTextColor={theme.colors.subtext}
                            value={text}
                            onChangeText={setText}
                            multiline
                        />
                        <TouchableOpacity onPress={handleSend} disabled={loading}>
                            <Ionicons name="send" size={24} color={text.trim() ? theme.colors.primary : theme.colors.subtext} />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

export default CommentsModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    content: {
        height: '80%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: ms(20),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(15),
    },
    title: {
        fontSize: ms(18),
        fontWeight: 'bold',
    },
    list: {
        paddingBottom: vs(20),
    },
    commentItem: {
        flexDirection: 'row',
        marginBottom: vs(15),
        gap: s(10),
    },
    avatar: {
        width: ms(36),
        height: ms(36),
        borderRadius: ms(18),
    },
    commentContent: {
        flex: 1,
    },
    username: {
        fontWeight: 'bold',
        fontSize: ms(14),
    },
    text: {
        fontSize: ms(14),
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        paddingTop: vs(10),
        gap: s(10),
    },
    input: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: s(15),
        paddingVertical: vs(8),
        maxHeight: vs(100),
    },
    empty: {
        textAlign: 'center',
        marginTop: vs(50),
    },
});
