import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getComments, addComment } from '../../services/PostService';
import { COLORS } from '../../utils/theme';
import { ms, s, vs } from '../../utils/responsive';
import AppText from '../common/AppText';

const CommentsModal = ({ visible, onClose, postId }) => {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

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
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <AppText.body style={styles.title}>Comments</AppText.body>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={COLORS.text} />
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
                                    <AppText.body style={styles.username}>{item.username}</AppText.body>
                                    <AppText.body style={styles.text}>{item.text}</AppText.body>
                                </View>
                            </View>
                        )}
                        contentContainerStyle={styles.list}
                        ListEmptyComponent={() => (
                            <AppText.body style={styles.empty}>No comments yet.</AppText.body>
                        )}
                    />

                    <View style={styles.footer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Add a comment..."
                            value={text}
                            onChangeText={setText}
                            multiline
                        />
                        <TouchableOpacity onPress={handleSend} disabled={loading}>
                            <Ionicons name="send" size={24} color={text.trim() ? COLORS.secondary : COLORS.grey} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
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
        backgroundColor: COLORS.background,
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
        color: COLORS.text,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: vs(10),
        gap: s(10),
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        paddingHorizontal: s(15),
        paddingVertical: vs(8),
        maxHeight: vs(100),
    },
    empty: {
        textAlign: 'center',
        marginTop: vs(50),
        color: COLORS.grey,
    },
});
