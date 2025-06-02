import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRouter} from "expo-router";

export default function LoginScreen() {
    const navigation = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Missing Info', 'Please enter both email and password.');
            return;
        }

        setIsLoading(true);

        try {
            // Check if user exists in AsyncStorage
            const userData = await AsyncStorage.getItem('user');
            if (!userData) {
                Alert.alert('Error', 'No user found. Please sign up first.');
                return;
            }

            const user = JSON.parse(userData);

            if (user.email !== email || user.password !== password) {
                Alert.alert('Error', 'Invalid email or password');
                return;
            }

            // Successful login
            Alert.alert('Login Success', `Welcome back, ${user.name || email}!`, [
                {
                    text: 'OK',
                    onPress: () =>  navigation.replace('/')
                }
            ]);

        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Error', 'Failed to login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignupRedirect = () => {
        navigation.replace('/signup');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.inner}>
                <Text style={styles.title}>Log In</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    onPress={handleLogin}
                    style={styles.button}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={styles.buttonText}>Continue</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleSignupRedirect}
                    style={styles.secondaryButton}
                >
                    <Text style={styles.secondaryButtonText}>Don't have an account? Sign Up</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
    },
    inner: {
        paddingHorizontal: 24,
        width: '100%',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 40,
        textAlign: 'left',
    },
    input: {
        backgroundColor: '#111',
        color: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#222',
    },
    button: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#fff',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});