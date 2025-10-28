
import { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

// This would be your actual logo component
const Logo = () => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(1.1, { damping: 0.5, stiffness: 100 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={[styles.logoContainer, animatedStyle]}>
      <ThemedText style={styles.logo}>R</ThemedText>
    </Animated.View>
  );
};

export default function AuthScreen() {
    const { signIn, signUp, signInWithGoogle } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedInput, setFocusedInput] = useState('');

    const handleSubmit = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setLoading(true);
        setError('');
        try {
            if (isLogin) {
                await signIn(email, password);
            } else {
                if (password !== confirmPassword) {
                    throw new Error('Passwords do not match');
                }
                await signUp(email, password, { name, username, birth_date: '2000-01-01' /* Dummy date */ });
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const handleGoogleSignIn = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <LinearGradient
                colors={['#0E0E0E', '#1A1A1A']}
                style={styles.background}
            />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Logo />
                <View style={styles.card}>
                    <View style={styles.segmentedControl}>
                        <TouchableOpacity 
                            style={[styles.segment, isLogin && styles.segmentActive]} 
                            onPress={() => setIsLogin(true)}
                        >
                            <ThemedText style={styles.segmentText}>Login</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.segment, !isLogin && styles.segmentActive]} 
                            onPress={() => setIsLogin(false)}
                        >
                            <ThemedText style={styles.segmentText}>Sign Up</ThemedText>
                        </TouchableOpacity>
                    </View>

                    {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

                    {isLogin ? (
                        <View>
                            <View style={styles.inputGroup}>
                                <ThemedText style={styles.label}>Email</ThemedText>
                                <TextInput
                                    style={[styles.input, focusedInput === 'email' && styles.inputFocused]}
                                    placeholder='user@example.com'
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize='none'
                                    keyboardType='email-address'
                                    placeholderTextColor="#888"
                                    onFocus={() => setFocusedInput('email')}
                                    onBlur={() => setFocusedInput('')}
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <ThemedText style={styles.label}>Password</ThemedText>
                                <TextInput
                                    style={[styles.input, focusedInput === 'password' && styles.inputFocused]}
                                    placeholder='********'
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    placeholderTextColor="#888"
                                    onFocus={() => setFocusedInput('password')}
                                    onBlur={() => setFocusedInput('')}
                                />
                            </View>
                        </View>
                    ) : (
                        <View>
                            <View style={styles.inputGroup}>
                                <ThemedText style={styles.label}>Name</ThemedText>
                                    <TextInput
                                        style={[styles.input, focusedInput === 'name' && styles.inputFocused]}
                                        placeholder='John Doe'
                                        value={name}
                                        onChangeText={setName}
                                        placeholderTextColor="#888"
                                        onFocus={() => setFocusedInput('name')}
                                        onBlur={() => setFocusedInput('')}
                                    />
                            </View>
                            <View style={styles.inputGroup}>
                                <ThemedText style={styles.label}>Username</ThemedText>
                                <TextInput
                                    style={[styles.input, focusedInput === 'username' && styles.inputFocused]}
                                    placeholder='johndoe'
                                    value={username}
                                    autoCapitalize='none'
                                    onChangeText={setUsername}
                                    placeholderTextColor="#888"
                                    onFocus={() => setFocusedInput('username')}
                                    onBlur={() => setFocusedInput('')}
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <ThemedText style={styles.label}>Email</ThemedText>
                                <TextInput
                                    style={[styles.input, focusedInput === 'email' && styles.inputFocused]}
                                    placeholder='user@example.com'
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize='none'
                                    keyboardType='email-address'
                                    placeholderTextColor="#888"
                                    onFocus={() => setFocusedInput('email')}
                                    onBlur={() => setFocusedInput('')}
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <ThemedText style={styles.label}>Password</ThemedText>
                                <TextInput
                                    style={[styles.input, focusedInput === 'password' && styles.inputFocused]}
                                    placeholder='********'
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    placeholderTextColor="#888"
                                    onFocus={() => setFocusedInput('password')}
                                    onBlur={() => setFocusedInput('')}
                                />
                            </View>
                             <View style={styles.inputGroup}>
                                <ThemedText style={styles.label}>Confirm Password</ThemedText>
                                <TextInput
                                    style={[styles.input, focusedInput === 'confirmPassword' && styles.inputFocused]}
                                    placeholder='********'
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                    placeholderTextColor="#888"
                                    onFocus={() => setFocusedInput('confirmPassword')}
                                    onBlur={() => setFocusedInput('')}
                                />
                            </View>
                        </View>
                    )}

                    {loading ? (
                        <ActivityIndicator size="large" color="#FF3CA6" />
                    ) : (
                         <>
                            <TouchableOpacity onPress={handleSubmit}>
                                <LinearGradient
                                    colors={['#FF3CA6', '#8A2BE2']}
                                    style={styles.button}
                                >
                                    <ThemedText style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</ThemedText>
                                </LinearGradient>
                            </TouchableOpacity>

                            <ThemedText style={styles.orText}>or</ThemedText>

                            <TouchableOpacity style={[styles.button, styles.googleButton]} onPress={handleGoogleSignIn}>
                                <Ionicons name="logo-google" size={24} color="white" style={{ marginRight: 10 }} />
                                <ThemedText style={styles.buttonText}>Continue with Google</ThemedText>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <View style={styles.footer}>
                     <ThemedText style={styles.footerText}>
                        By continuing, you agree to our{' '}
                        <Text style={styles.link}>Terms of Service</Text> and{' '}
                        <Text style={styles.link}>Privacy Policy</Text>.
                    </ThemedText>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        fontSize: 80,
        fontWeight: 'bold',
        color: 'white',
        width: 120,
        height: 120,
        borderRadius: 60,
        textAlign: 'center',
        lineHeight: 120,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
    },
    card: {
        backgroundColor: 'rgba(26, 26, 26, 0.8)',
        borderRadius: 20,
        padding: 20,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
    },
    segmentedControl: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        marginBottom: 20,
    },
    segment: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    segmentActive: {
        backgroundColor: '#FF3CA6',
    },
    segmentText: {
        color: 'white',
        fontWeight: 'bold',
    },
    error: {
        color: '#FF5A5F',
        textAlign: 'center',
        marginBottom: 10,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        color: '#A0A0A0',
        marginBottom: 5,
        fontSize: 14,
    },
    input: {
        backgroundColor: '#1A1A1A',
        color: 'white',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FF3CA6',
    },
    inputFocused: {
        borderColor: '#8A2BE2',
        shadowColor: '#8A2BE2',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 5,
    },
    button: {
        padding: 15,
        borderRadius: 12,
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
    footer: {
        marginTop: 20,
        alignItems: 'center',
    },
    footerText: {
        color: '#A0A0A0',
        textAlign: 'center',
    },
    link: {
        color: '#00D1FF',
        textDecorationLine: 'underline',
    },
});