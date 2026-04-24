import { useState, useCallback, useEffect } from 'react';
import { updateProfile as updateProfileService, getUserData, searchUsers as searchUsersService } from '../services/UserService';
import auth from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';

export const useUser = (initialUserId = null) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    const fetchUserData = useCallback(async (userId) => {
        if (!userId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const data = await getUserData(userId);
            setUserData(data);
        } catch (error) {
            console.error('Error in useUser fetch:', error);
            setUserData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let unsubscribe;
        
        const userId = initialUserId || auth().currentUser?.uid;
        
        if (userId) {
            setLoading(true);
            unsubscribe = getFirestore()
                .collection('users')
                .doc(userId)
                .onSnapshot(
                    doc => {
                        if (doc.exists) {
                            setUserData({ id: doc.id, ...doc.data() });
                        }
                        setLoading(false);
                    },
                    error => {
                        console.error('Error listening to user data:', error);
                        setLoading(false);
                    }
                );
        } else {
            setLoading(false);
        }

        return () => unsubscribe && unsubscribe();
    }, [initialUserId]);

    const updateProfile = useCallback(async (data) => {
        setLoading(true);
        try {
            const updated = await updateProfileService(data);
            setUserData(prev => ({ ...prev, ...updated }));
            return updated;
        } finally {
            setLoading(false);
        }
    }, []);

    const searchUsers = useCallback(async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        setSearchLoading(true);
        try {
            const results = await searchUsersService(query);
            setSearchResults(results);
        } finally {
            setSearchLoading(false);
        }
    }, []);

    return {
        userData,
        loading,
        updateProfile,
        fetchUserData,
        searchUsers,
        searchResults,
        searchLoading,
    };
};
