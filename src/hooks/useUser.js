import { useState, useCallback, useEffect } from 'react';
import { updateProfile as updateProfileService, getUserData, searchUsers as searchUsersService } from '../services/UserService';
import auth from '@react-native-firebase/auth';

export const useUser = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    const fetchUserData = useCallback(async (userId) => {
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
        const user = auth().currentUser;
        if (user) {
            fetchUserData(user.uid);
        } else {
            setLoading(false);
        }
    }, [fetchUserData]);

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
