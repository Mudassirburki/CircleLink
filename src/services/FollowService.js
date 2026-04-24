import firestore from '@react-native-firebase/firestore';

const followsCollection = firestore().collection('follows');
const userCollection = firestore().collection('users');

/**
 * followUser
 * @param {string} followerId - The ID of the user who is following
 * @param {string} followingId - The ID of the user being followed
 */
export const followUser = async (followerId, followingId) => {
    if (followerId === followingId) throw new Error("You cannot follow yourself");

    const batch = firestore().batch();
    const followDocId = `${followerId}_${followingId}`;
    const followRef = followsCollection.doc(followDocId);

    // 1. Create Follow document
    batch.set(followRef, {
        followerId,
        followingId,
        createdAt: firestore.FieldValue.serverTimestamp(),
    });

    // 2. Increment followingCount for the follower
    batch.update(userCollection.doc(followerId), {
        followingCount: firestore.FieldValue.increment(1)
    });

    // 3. Increment followersCount for the user being followed
    batch.update(userCollection.doc(followingId), {
        followersCount: firestore.FieldValue.increment(1)
    });

    await batch.commit();
};

/**
 * unfollowUser
 * @param {string} followerId 
 * @param {string} followingId 
 */
export const unfollowUser = async (followerId, followingId) => {
    const batch = firestore().batch();
    const followDocId = `${followerId}_${followingId}`;
    const followRef = followsCollection.doc(followDocId);

    // 1. Delete Follow document
    batch.delete(followRef);

    // 2. Decrement followingCount for the follower
    batch.update(userCollection.doc(followerId), {
        followingCount: firestore.FieldValue.increment(-1)
    });

    // 3. Decrement followersCount for the user being followed
    batch.update(userCollection.doc(followingId), {
        followersCount: firestore.FieldValue.increment(-1)
    });

    await batch.commit();
};

/**
 * checkIfFollowing
 * @param {string} followerId 
 * @param {string} followingId 
 */
export const checkIfFollowing = async (followerId, followingId) => {
    const followDocId = `${followerId}_${followingId}`;
    const doc = await followsCollection.doc(followDocId).get();
    return doc.exists;
};
