import auth from '@react-native-firebase/auth';

export const signUp = async (email, password) => {
    return await auth().createUserWithEmailAndPassword(email, password);
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
