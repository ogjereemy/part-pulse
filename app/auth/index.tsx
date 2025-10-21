import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AuthScreen() {
    const { signIn, signUp, signInWithGoogle } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [birthDate, setBirthDate] = useState(new Date(2000, 0, 1)); // Default to a date that is likely over 18
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || birthDate;
        setShowDatePicker(false); // Always hide after selection or dismissal
        if (event.type === 'set') { // Only update date if a date was actually selected
            setBirthDate(currentDate);
        }
    };

    const getMaxDate = () => {
        const today = new Date();
        const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        return maxDate;
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            setError('');
            if (isLogin) {
                await signIn(email, password);
            } else {
                if (password !== confirmPassword) {
                    setError('Passwords do not match');
                    return;
                }
                const age = new Date().getFullYear() - birthDate.getFullYear();
                if (age < 18) { // Example age restriction
                    setError('You must be at least 18 years old to sign up.');
                    return;
                }
                await signUp(email, password, {
                    name,
                    username,
                    birth_date: birthDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
                });
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            setError('');
            await signInWithGoogle();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <LinearGradient
            colors={['#1a001a', '#000']}
            style={styles.container}
        >
            <ThemedText style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</ThemedText>
            <ThemedText style={styles.subtitle}>{isLogin ? 'Sign in to continue' : 'Join the pulse of the night'}</ThemedText>

            {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

            <TextInput
                style={styles.input}
                placeholder='Email'
                value={email}
                onChangeText={setEmail}
                autoCapitalize='none'
                keyboardType='email-address'
                placeholderTextColor="#888"
            />
            {!isLogin && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder='Name'
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor="#888"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Username'
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize='none'
                        placeholderTextColor="#888"
                    />
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                        <ThemedText style={{ color: birthDate ? 'white' : '#888' }}>
                            {birthDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </ThemedText>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={birthDate}
                            mode="date"
                            display="default"
                            maximumDate={getMaxDate()}
                            onChange={onDateChange}
                        />
                    )}
                    <TextInput
                        style={styles.input}
                        placeholder='Password'
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholderTextColor="#888"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        placeholderTextColor="#888"
                    />
                </>
            )}
            {isLogin && (
                <TextInput
                    style={styles.input}
                    placeholder='Password'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#888"
                />
            )}

            {loading ? (
                <ActivityIndicator size="large" color={Colors.dark.tint} />
            ) : (
                <>
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <ThemedText style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</ThemedText>
                    </TouchableOpacity>

                    <ThemedText style={styles.orText}>or</ThemedText>

                    <TouchableOpacity style={[styles.button, styles.googleButton]} onPress={handleGoogleSignIn}>
                        <Ionicons name="logo-google" size={24} color="white" style={{ marginRight: 10 }} />
                        <ThemedText style={styles.buttonText}>Sign in with Google</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                        <ThemedText style={styles.switchText}>
                            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
                        </ThemedText>
                    </TouchableOpacity>
                </>
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: 'white',
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 30,
        color: '#888',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
    input: {
        height: 50,
        borderColor: '#333',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        color: 'white',
        fontSize: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    button: {
        backgroundColor: Colors.dark.tint,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
    },
    googleButton: {
        backgroundColor: '#4285F4',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    orText: {
        textAlign: 'center',
        marginVertical: 10,
        color: '#888',
    },
    switchText: {
        textAlign: 'center',
        color: Colors.dark.tint,
        marginTop: 10,
    },
});