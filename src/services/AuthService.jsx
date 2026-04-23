import auth from '@react-native-firebase/auth';

import firestore from '@react-native-firebase/firestore';

export const signUp = async (email, password, name) => {
    try {
        console.log('Starting signup for:', email);
        const { user } = await auth().createUserWithEmailAndPassword(email, password);
        console.log('Firebase user created:', user.uid);
        
        // Ensure auth state is recognized locally
        console.log('Current auth state:', auth().currentUser?.uid);

        // Update Firebase Auth profile
        await user.updateProfile({ displayName: name });

        // Create user document in Firestore - MUST await this
        const userDocData = {
            uid: user.uid,
            name: name,
            email: email,
            avatar: null,
            bio: 'New member at CircleLink',
            createdAt: firestore.FieldValue.serverTimestamp(),
        };

        console.log('Attempting to write user document to Firestore...');
        await firestore().collection('users').doc(user.uid).set(userDocData);
        console.log('User document created successfully!');

        return user;
    } catch (error) {
        console.error('CRITICAL: Error in signUp flow:', error);
        throw error;
    }
}

export const signIn = async (email, password) => {
    return await auth().signInWithEmailAndPassword(email, password);
}

export const signOut = async () => {
    return await auth().signOut();
}

export const getCurrentUser = async () => {
    return await auth().currentUser;
}

// export const onAuthStateChanged = async (callback) => {
//     return await auth().onAuthStateChanged(callback);
// }
