import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    initialized: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, userData?: { name: string; username: string; birth_date: string }) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    updatePhoneNumber: (phoneNumber: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [initializing, setInitializing] = useState(true);


    useEffect(() => {
        const fetchSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
                setUser(session?.user ?? null);
                if (session) {
                    await SecureStore.setItemAsync('supabase.auth.token', session.access_token);
                } else {
                    await SecureStore.deleteItemAsync('supabase.auth.token');
                }
            } catch (error) {
                console.error('Error fetching session:', error as Error);
            } finally {
                setInitializing(false);
            }
        };

        fetchSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session) {
                SecureStore.setItemAsync('supabase.auth.token', session.access_token);
            } else {
                SecureStore.deleteItemAsync('supabase.auth.token');
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };

    const signUp = async (email: string, password: string, userData?: { name: string; username: string; birth_date: string }) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: userData?.name,
                    username: userData?.username,
                    birth_date: userData?.birth_date,
                }
            }
        });
        if (error) throw error;
    };

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
        if (error) throw error;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    const updatePhoneNumber = async (phoneNumber: string) => {
        const { data, error } = await supabase.auth.updateUser({
            phone: phoneNumber,
        });
        if (error) throw error;
        if (data.user) {
            setUser(data.user);
        }
    };

    return (
        <AuthContext.Provider value={{ user, session, initialized: !initializing, signIn, signUp, signInWithGoogle, signOut, updatePhoneNumber }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}