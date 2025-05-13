// screens/LoginScreen.js
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Aquí iría la lógica real de login
        alert(`Iniciando sesión con ${email}`);
    };

    return (
        <View style={styles.safe}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Parte superior */}
                <View style={styles.topSection}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={width * 0.06} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.loginTitle}>Login</Text>
                </View>

                {/* Parte inferior */}
                <View style={styles.bottomSection}>
                    <Image source={require('../assets/logo.png')} style={styles.logo} />

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity>
                        <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Iniciar sesión</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.signupText}>¿No tienes cuenta? Regístrate</Text>
                    </TouchableOpacity>

                    <Text style={styles.orText}>O</Text>

                    <TouchableOpacity style={styles.googleButton}>
                        <Image
                            source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
                            style={styles.googleIcon}
                        />
                        <Text style={styles.googleText}>Iniciar sesión con Google</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flexGrow: 1,
    },
    topSection: {
        backgroundColor: '#0A0E21',
        paddingVertical: width * 0.2,
        alignItems: 'center',
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
    },
    loginTitle: {
        color: '#fff',
        fontSize: width * 0.08,
        fontWeight: 'bold',
    },
    bottomSection: {
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 24,
    },
    logo: {
        width: width * 0.25,
        height: width * 0.25,
        resizeMode: 'contain',
        marginBottom: 24,
    },
    input: {
        width: '100%',
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        fontSize: width * 0.04,
    },
    forgot: {
        alignSelf: 'flex-end',
        marginBottom: 16,
        color: '#007bff',
        fontSize: width * 0.035,
    },
    loginButton: {
        backgroundColor: '#0A0E21',
        width: '100%',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 12,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: width * 0.045,
    },
    signupText: {
        color: '#000',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        fontSize: width * 0.04,
        marginBottom: 10,
    },
    orText: {
        color: '#666',
        marginBottom: 10,
        fontSize: width * 0.04,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
    },
    googleIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    googleText: {
        fontWeight: 'bold',
        fontSize: width * 0.04,
    },
});
