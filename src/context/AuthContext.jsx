import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../services/api';

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    /**
     * 1. Load User from storage on startup
     */
    const loadUser = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            const storedUser = await AsyncStorage.getItem('user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                console.log('[AUTH] User loaded from storage');
            }
        } catch (error) {
            console.error('[AUTH] Failed to load user from storage', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * 2. Signup Function
     * Safely handles cases where token might be missing
     */
    const signup = async (name, email, phone, password) => {
        try {
            const res = await API.post('/auth/signup', { name, email, phone, password });

            const { token: receivedToken, user: receivedUser } = res.data;

            // Check if user object exists (minimum requirement for success)
            if (!receivedUser) {
                return { success: false, message: 'Signup failed: Server did not return user data' };
            }

            // Handle optional token (Backend might require manual login after signup)
            if (receivedToken) {
                await AsyncStorage.setItem('token', String(receivedToken));
                await AsyncStorage.setItem('user', JSON.stringify(receivedUser));
                setToken(receivedToken);
                setUser(receivedUser);
                return { success: true, message: 'Signup successful!' };
            } else {
                // If no token, user is signed up but NOT logged in (depends on backend logic)
                return {
                    success: true,
                    message: 'Account created successfully! Please log in.',
                    requiresLogin: true
                };
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Signup failed';
            console.error('[AUTH] Signup error:', message);
            return { success: false, message };
        }
    };

    /**
     * 3. Login Function
     */
    const login = async (email, password) => {
        try {
            const res = await API.post('/auth/login', { email, password });
            const { token: receivedToken, user: receivedUser } = res.data;

            if (!receivedToken || !receivedUser) {
                return { success: false, message: 'Invalid server response: Missing credentials' };
            }

            await AsyncStorage.setItem('token', String(receivedToken));
            await AsyncStorage.setItem('user', JSON.stringify(receivedUser));

            setToken(receivedToken);
            setUser(receivedUser);
            return { success: true, message: 'Login successful!' };
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Login failed';
            console.error('[AUTH] Login error:', message);
            return { success: false, message };
        }
    };

    /**
     * 4. Logout Function
     */
    const logout = async () => {
        try {
            await AsyncStorage.multiRemove(['token', 'user']);
            setToken(null);
            setUser(null);
            console.log('[AUTH] Logged out');
        } catch (error) {
            console.error('[AUTH] Logout error:', error);
        }
    };

    /**
     * 5. Update User Function
     */
    const updateUser = async (updatedUserData) => {
        try {
            setUser((prevUser) => {
                const newUser = { ...prevUser, ...updatedUserData };
                AsyncStorage.setItem('user', JSON.stringify(newUser)).catch((err) =>
                    console.error('[AUTH] Failed to update user in storage:', err)
                );
                return newUser;
            });
        } catch (error) {
            console.error('[AUTH] Update user error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            signup,
            login,
            logout,
            updateUser,
            loading,
            setUser,
            setToken
        }}>
            {children}
        </AuthContext.Provider>
    );
};