import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

const postCollection = firestore().collection('posts');

export const createPost = async (imageUri, caption) => {
    
    try {
        const user = auth().currentUser;
        if (!user) throw new Error('User not authenticated');

        let imageUrl = null;

        // Only upload to Storage if an image is provided
        if (imageUri) {
            const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
            const storageRef = storage().ref(`posts/${user.uid}/${Date.now()}_${filename}`);
            await storageRef.putFile(imageUri);
            imageUrl = await storageRef.getDownloadURL();
        }

        const postData = {
            userId: user.uid,
            username: user.displayName || 'Unknown',
            userImage: user.photoURL || null,
            imageUrl: imageUrl, // Now optional
            caption,
            likesCount: 0,
            likes: [],
            commentsCount: 0,
            createdAt: firestore.FieldValue.serverTimestamp(),
        };

        return await postCollection.add(postData);
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

export const getFeedPosts = (callback) => {
    return postCollection
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            const posts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            callback(posts);
        }, error => {
            console.error('Error fetching feed posts:', error);
        });
};

export const toggleLike = async (postId, userId, isLiked) => {
    try {
        const postRef = postCollection.doc(postId);
        if (isLiked) {
            await postRef.update({
                likes: firestore.FieldValue.arrayRemove(userId),
                likesCount: firestore.FieldValue.increment(-1),
            });
        } else {
            await postRef.update({
                likes: firestore.FieldValue.arrayUnion(userId),
                likesCount: firestore.FieldValue.increment(1),
            });
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        throw error;
    }
};

export const addComment = async (postId, text) => {
    try {
        const user = auth().currentUser;
        if (!user) throw new Error('User not authenticated');

        const commentData = {
            postId,
            userId: user.uid,
            username: user.displayName || 'Unknown',
            userImage: user.photoURL || null,
            text,
            createdAt: firestore.FieldValue.serverTimestamp(),
        };

        await firestore().collection('comments').add(commentData);
        await postCollection.doc(postId).update({
            commentsCount: firestore.FieldValue.increment(1),
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
};

export const getComments = (postId, callback) => {
    return firestore()
        .collection('comments')
        .where('postId', '==', postId)
        .orderBy('createdAt', 'asc')
        .onSnapshot(snapshot => {
            const comments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            callback(comments);
        }, error => {
            console.error('Error fetching comments:', error);
        });
};

export const getUserPosts = async (userId) => {
    try {
        const snapshot = await postCollection
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error('Error fetching user posts:', error);
        throw error;
    }
};
