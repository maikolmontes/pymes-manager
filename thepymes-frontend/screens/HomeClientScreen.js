// screens/HomeClientScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function HomeClientScreen({ route }) {
    const { user } = route.params;

    return (
        <View style={styles.container}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <Text style={styles.welcome}>¡Hola {user.name}!</Text>
            <Text style={styles.role}>Eres un Cliente registrado ✅</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f8',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    welcome: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    role: {
        fontSize: 18,
        color: '#2196F3',
    },
});
