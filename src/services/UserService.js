import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

const userCollection = firestore().collection('users');

export const updateProfile = async (userData) => {
    try {
        const user = auth().currentUser;
        if (!user) throw new Error('User not authenticated');

        let avatarUrl = userData.avatar;

        if (userData.avatar && !userData.avatar.startsWith('http')) {
            const filename = userData.avatar.substring(userData.avatar.lastIndexOf('/') + 1);
            const storageRef = storage().ref(`avatars/${user.uid}/${filename}`);
            await storageRef.putFile(userData.avatar);
            avatarUrl = await storageRef.getDownloadURL();
        }

        const updatedData = {
            name: userData.name,
            username: userData.username,
            bio: userData.bio,
            avatar: avatarUrl,
            updatedAt: firestore.FieldValue.serverTimestamp(),
        };

        // Update Firestore
        await userCollection.doc(user.uid).set(updatedData, { merge: true });

        // Update Firebase Auth profile
        await user.updateProfile({
            displayName: userData.name,
            photoURL: avatarUrl,
        });

        return updatedData;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

export const getUserData = async (userId) => {
    try {
        const doc = await userCollection.doc(userId).get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

export const searchUsers = async (query) => {
    try {
        const snapshot = await userCollection
            .where('name', '>=', query)
            .where('name', '<=', query + '\uf8ff')
            .get();
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
};
