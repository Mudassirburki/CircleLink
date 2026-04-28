import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

const userCollection = firestore().collection('users');

export const updateProfile = async (data) => {
    try {
        const user = auth().currentUser;
        if (!user) throw new Error('User not authenticated');

        let avatarUrl = data.avatar;

        if (data.avatar && typeof data.avatar === 'string' && !data.avatar.startsWith('http')) {
            const filename = data.avatar.substring(data.avatar.lastIndexOf('/') + 1);
            const storageRef = storage().ref(`avatars/${user.uid}/${filename}`);
            await storageRef.putFile(data.avatar);
            avatarUrl = await storageRef.getDownloadURL();
        }

        const updatedData = {
            ...data,
            updatedAt: firestore.FieldValue.serverTimestamp(),
        };

        if (avatarUrl) {
            updatedData.avatar = avatarUrl;
        }

        // Update Firestore
        await userCollection.doc(user.uid).set(updatedData, { merge: true });

        // Update Firebase Auth profile if name or avatar changed
        if (data.name || avatarUrl) {
            await user.updateProfile({
                displayName: data.name || user.displayName,
                photoURL: avatarUrl || user.photoURL,
            });
        }

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
