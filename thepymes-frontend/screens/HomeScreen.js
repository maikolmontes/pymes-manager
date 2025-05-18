import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../context/UserContext';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const navigation = useNavigation();
    const { user } = useContext(UserContext);

    const testimonials = [
        {
            name: 'Laura M. - Frutería Natural',
            text: 'The PYMES Manager me ayudó a ganar más visibilidad en mi barrio. 💡',
        },
        {
            name: 'Carlos R. - Barbería El Estilo',
            text: 'Ahora mis clientes me encuentran fácilmente gracias al mapa. ✂️',
        },
        {
            name: 'Sofía G. - Tienda Variedades',
            text: '¡Súper útil y fácil de usar! Me encanta la interfaz. 📱',
        },
    ];

    // 🧑‍💼 Vista del EMPRENDEDOR
    if (user?.user_type === 'Emprendedor') {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Bienvenido, {user.name}</Text>
                <Text style={styles.subtitle}>Panel del Emprendedor</Text>
                <View style={styles.cardGrid}>
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Registro Negocios')}>
                        <Image source={require('../assets/add.png')} style={styles.cardIcon} />
                        <Text style={styles.cardText}>Registrar Negocio</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Mis Negocios')}>
                        <Image source={require('../assets/list.png')} style={styles.cardIcon} />
                        <Text style={styles.cardText}>Mis Negocios</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Mapa')}>
                        <Image source={require('../assets/map.png')} style={styles.cardIcon} />
                        <Text style={styles.cardText}>Ver en Mapa</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card}>
                        <Image source={require('../assets/chart.png')} style={styles.cardIcon} />
                        <Text style={styles.cardText}>Estadísticas</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }

    // 🧍 Cliente o visitante
    return (
        <ScrollView contentContainerStyle={styles.clientContainer}>
            <Text style={styles.title}>The PYMES Manager</Text>
            <Text style={styles.subtitle}>Conectamos tu comunidad con los pequeños negocios 📍</Text>
            <Image
                source={require('../assets/home-mini.png')}
                style={styles.banner}
            />

            <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>¿Qué puedes hacer aquí?</Text>
                <Text style={styles.infoItem}>• Explorar negocios cercanos</Text>
                <Text style={styles.infoItem}>• Descubrir tiendas por categoría</Text>
                <Text style={styles.infoItem}>• Apoyar emprendedores locales</Text>
            </View>

            <TouchableOpacity style={styles.mainButton} onPress={() => navigation.navigate('Mapa')}>
                <Text style={styles.buttonText}>📍 Ver negocios en el mapa</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Lista Negocios')}>
                <Text style={styles.secondaryText}>🛍️ Ver todos los negocios</Text>
            </TouchableOpacity>

            {/* Reseñas / Testimonios */}
            <Text style={styles.sectionTitle}>Lo que dicen nuestros usuarios 💬</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.testimonialsContainer}
                contentContainerStyle={{ paddingLeft: 10 }}
            >
                {testimonials.map((item, index) => (
                    <View key={index} style={styles.testimonialCard}>
                        <MaterialIcons
                            name="format-quote"
                            size={24}
                            color="#3498db"
                            style={styles.quoteIcon}
                        />
                        <Text style={styles.testimonialText}>{item.text}</Text>
                        <Text style={styles.testimonialName}>— {item.name}</Text>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.footerNote}>
                <Text style={styles.footerText}>¿Eres emprendedor?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('IniciarSesion')}>
                    <Text style={styles.footerLink}>Inicia sesión para registrar tu negocio</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: '#f4f6f8',
        alignItems: 'center',
    },
    clientContainer: {
        padding: 24,
        backgroundColor: '#F2F9FF',
        alignItems: 'center',
    },
    title: {
        fontSize: width * 0.07,
        fontWeight: 'bold',
        color: '#0A0E21',
        textAlign: 'center',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: width * 0.045,
        color: '#444',
        marginBottom: 20,
        textAlign: 'center',
    },
    banner: {
        width: width * 0.6,
        height: width * 0.4,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    infoBox: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        width: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
    },
    infoTitle: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#0A0E21',
    },
    infoItem: {
        fontSize: width * 0.04,
        color: '#333',
        marginBottom: 5,
    },
    mainButton: {
        backgroundColor: '#0A0E21',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        width: '100%',
        marginBottom: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: width * 0.045,
        fontWeight: 'bold',
    },
    secondaryButton: {
        borderWidth: 2,
        borderColor: '#0A0E21',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        width: '100%',
    },
    secondaryText: {
        color: '#0A0E21',
        fontSize: width * 0.042,
        fontWeight: 'bold',
    },
    footerNote: {
        marginTop: 24,
        alignItems: 'center',
    },
    footerText: {
        color: '#555',
        fontSize: width * 0.04,
    },
    footerLink: {
        color: '#007BFF',
        fontSize: width * 0.042,
        textDecorationLine: 'underline',
        marginTop: 6,
    },
    cardGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        width: width * 0.4,
        height: width * 0.4,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
    },
    cardIcon: {
        width: 40,
        height: 40,
        marginBottom: 10,
        resizeMode: 'contain',
    },
    cardText: {
        fontSize: width * 0.038,
        textAlign: 'center',
        color: '#333',
    },
    sectionTitle: {
        fontSize: width * 0.05,
        fontWeight: '600',
        color: '#0A0E21',
        marginVertical: 18,
        alignSelf: 'flex-start',
    },
    testimonialsContainer: {
        marginBottom: 20,
        width: '100%',
    },
    testimonialCard: {
        width: width * 0.7,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginRight: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    quoteIcon: {
        marginBottom: 10,
    },
    testimonialText: {
        fontSize: width * 0.035,
        color: '#34495e',
        lineHeight: 22,
        marginBottom: 10,
    },
    testimonialName: {
        fontSize: width * 0.033,
        color: '#3498db',
        fontWeight: '600',
    },
});
