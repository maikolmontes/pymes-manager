import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Linking } from 'react-native';

const { width } = Dimensions.get('window');

export default function ContactScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        // Aquí puedes agregar la lógica para manejar el envío del formulario
        console.log({ name, email, message });
    };

    const openURL = (url) => {
        Linking.openURL(url).catch((err) => console.error("No se pudo abrir la URL: ", err));
    };

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Icon name="email" size={40} color="#2196F3" />
                    <Text style={styles.title}>¡Contáctanos!</Text>
                </View>

                <View style={styles.separator} />

                <Text style={styles.text}>
                    ¿Tienes alguna pregunta o sugerencia? Llena el siguiente formulario y nos pondremos en contacto contigo.
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Tu nombre"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Tu correo electrónico"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Tu mensaje"
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    numberOfLines={4}
                />

                <Button title="Enviar" color="#2196F3" onPress={handleSubmit} />

                <View style={styles.socialContainer}>
                    <Text style={styles.socialText}>Síguenos en nuestras redes sociales:</Text>
                    <View style={styles.socialIcons}>
                        <TouchableOpacity onPress={() => openURL('https://www.facebook.com/')}>
                            <Icon name="facebook" size={30} color="#3b5998" style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openURL('https://twitter.com/')}>
                            <Icon name="twitter" size={30} color="#00acee" style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openURL('https://www.instagram.com/')}>
                            <Icon name="instagram" size={30} color="#e4405f" style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openURL('https://wa.me/')}>
                            <Icon name="whatsapp" size={30} color="#25d366" style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: '#2196F3',
        marginLeft: 10,
    },
    separator: {
        height: 2,
        backgroundColor: '#2196F3',
        width: '30%',
        alignSelf: 'center',
        marginVertical: 15,
    },
    text: {
        fontSize: width * 0.043,
        lineHeight: 24,
        textAlign: 'center',
        color: '#444',
        marginBottom: 20,
    },
    input: {
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 10,
        fontSize: width * 0.04,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    socialContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    socialText: {
        fontSize: width * 0.045,
        marginBottom: 10,
        color: '#444',
    },
    socialIcons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '60%',
    },
    icon: {
        margin: 10,
    },
});
