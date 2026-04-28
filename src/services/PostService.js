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

        const docRef = await postCollection.add(postData);

        // 3. Increment postsCount in user document
        await firestore().collection('users').doc(user.uid).update({
            postsCount: firestore.FieldValue.increment(1)
        });

        return docRef;
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

/**
 * Fetch posts with pagination (cursor-based)
 * @param {Object} lastVisible - The last document snapshot from the previous page
 * @param {number} pageSize - Number of posts to fetch
 */
export const getPaginatedPosts = async (lastVisible = null, pageSize = 5) => {
    try {
        let query = postCollection.orderBy('createdAt', 'desc').limit(pageSize);

        if (lastVisible) {
            query = query.startAfter(lastVisible);
        }

        const snapshot = await query.get();
        
        const posts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        const lastDoc = snapshot.docs[snapshot.docs.length - 1];
        
        return {
            posts,
            lastDoc,
            hasMore: snapshot.docs.length === pageSize
        };
    } catch (error) {
        console.error('Error fetching paginated posts:', error);
        throw error;
    }
};

export const toggleLike = async (postId, userId, isLiked) => {
    try {
        const postRef = postCollection.doc(postId);
        if (isLiked) {
            await postRef.update({
                likes: firestore.FieldValue.arrayRemove(userId),
                likesCount: firestore.FieldValue.increment(-1),
            });
            // Optional: Remove from root likes collection if you want clean data
            await firestore().collection('likes').doc(`${userId}_${postId}`).delete();
        } else {
            await postRef.update({
                likes: firestore.FieldValue.arrayUnion(userId),
                likesCount: firestore.FieldValue.increment(1),
            });
            // 🚀 Write to root-level likes collection to trigger Cloud Function
            await firestore().collection('likes').doc(`${userId}_${postId}`).set({
                postId,
                userId,
                createdAt: firestore.FieldValue.serverTimestamp(),
            });
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        throw error;
    }
};

export const toggleSavePost = async (postId, userId, isSaved) => {
    try {
        const postRef = postCollection.doc(postId);
        if (isSaved) {
            await postRef.update({
                savedBy: firestore.FieldValue.arrayRemove(userId),
            });
        } else {
            await postRef.update({
                savedBy: firestore.FieldValue.arrayUnion(userId),
            });
        }
    } catch (error) {
        console.error('Error toggling save:', error);
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

export const getLikedPosts = (userId, callback) => {
    return postCollection
        .where('likes', 'array-contains', userId)
        .onSnapshot(snapshot => {
            const posts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            callback(posts);
        }, error => {
            console.error('Error fetching liked posts:', error);
        });
};

export const getSavedPosts = (userId, callback) => {
    return postCollection
        .where('savedBy', 'array-contains', userId)
        .onSnapshot(snapshot => {
            const posts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            callback(posts);
        }, error => {
            console.error('Error fetching saved posts:', error);
        });
};


export const getPostById = async (postId) => {
    try {
        const doc = await postCollection.doc(postId).get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error fetching post by ID:', error);
        throw error;
    }
};

export const onPostUpdate = (postId, callback) => {
    return postCollection.doc(postId).onSnapshot(doc => {
        if (doc.exists) {
            callback({ id: doc.id, ...doc.data() });
        }
    }, error => {
        console.error('Error listening to post updates:', error);
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
