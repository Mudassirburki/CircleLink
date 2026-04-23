import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signUp, signIn, signOut, getCurrentUser } from '../services/AuthService';

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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    /**
     * 1. Load User from storage/firebase on startup
     */
    const loadUser = async () => {
        try {
            const firebaseUser = await getCurrentUser();
            if (firebaseUser) {
                setUser(firebaseUser);
                console.log('[AUTH] User loaded from Firebase');
            } else {
                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            }
        } catch (error) {
            console.error('[AUTH] Failed to load user', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * 2. Signup Function
     */
    const signup = async (email, password, name, phone) => {
        try {
            const userCredential = await signUp(email, password);
            const firebaseUser = userCredential.user;

            // In a real app, you'd save name and phone to Firestore here
            const userData = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: name,
                phone: phone
            };

            await AsyncStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            return { success: true, message: 'Signup successful!' };
        } catch (error) {
            const message = error.message || 'Signup failed';
            console.error('[AUTH] Signup error:', message);
            return { success: false, message };
        }
    };

    /**
     * 3. Login Function
     */
    const login = async (email, password) => {
        try {
            const userCredential = await signIn(email, password);
            const firebaseUser = userCredential.user;

            const userData = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || 'User',
            };

            await AsyncStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            return { success: true, message: 'Login successful!' };
        } catch (error) {
            const message = error.message || 'Login failed';
            console.error('[AUTH] Login error:', message);
            return { success: false, message };
        }
    };

    /**
     * 4. Logout Function
     */
    const logout = async () => {
        try {
            await signOut();
            await AsyncStorage.removeItem('user');
            setUser(null);
            console.log('[AUTH] Logged out from Firebase');
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
            signup,
            login,
            logout,
            updateUser,
            loading,
            setUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
};