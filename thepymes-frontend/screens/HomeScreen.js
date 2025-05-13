// screens/HomeScreen.js
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    MaterialIcons,
    FontAwesome5,
    Ionicons,
    Feather,
    MaterialCommunityIcons,
} from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const features = [
    {
        icon: <Ionicons name="location-sharp" size={28} color="#4CAF50" />,
        title: "Geolocalización",
        description: "Mayor visibilidad para tu negocio en tu zona",
        screen: "Mapa",
    },
    {
        icon: <FontAwesome5 name="chart-line" size={24} color="#2196F3" />,
        title: "Análisis de Negocio",
        description: "Mide el rendimiento de tu emprendimiento",
        screen: "Features",
    },
    {
        icon: <MaterialIcons name="attach-money" size={26} color="#FF9800" />,
        title: "Gestión Financiera",
        description: "Controla ingresos, gastos y facturación",
        screen: "Features",
    },
    {
        icon: <Feather name="users" size={24} color="#9C27B0" />,
        title: "Conexión con Clientes",
        description: "Atrae y fideliza a tus clientes",
        screen: "Features",
    },
];

const testimonials = [
    {
        name: "Ana M. - Tienda de Artesanías",
        text: "Gracias a The Pymes Manager he aumentado mis clientes en un 30%",
    },
    {
        name: "Carlos P. - Cafetería",
        text: "La geolocalización ha sido clave para que me encuentren",
    },
];

export default function HomeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <MaterialCommunityIcons name="storefront" size={width * 0.15} color="#3498db" />
                    </View>
                    <Text style={styles.title}>The Pymes Manager</Text>
                    <Text style={styles.subtitle}>San Juan de Pasto</Text>
                    <Text style={styles.tagline}>Impulsando tu negocio local</Text>
                </View>

                {/* Banner */}
                <View style={styles.banner}>
                    <MaterialIcons name="devices" size={32} color="white" style={styles.bannerIcon} />
                    <Text style={styles.bannerText}>¡Digitaliza tu negocio hoy!</Text>
                    <Text style={styles.bannerSubtext}>Aumenta tu visibilidad y clientes</Text>
                </View>

                {/* Características */}
                <Text style={styles.sectionTitle}>¿Cómo te ayudamos?</Text>
                <View style={styles.featuresContainer}>
                    {features.map((feature, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.featureCard}
                            onPress={() => navigation.navigate(feature.screen)}
                        >
                            <View style={styles.iconContainer}>{feature.icon}</View>
                            <Text style={styles.featureTitle}>{feature.title}</Text>
                            <Text style={styles.featureDescription}>{feature.description}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Testimonios */}
                <Text style={styles.sectionTitle}>Historias de éxito</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.testimonialsContainer}
                >
                    {testimonials.map((testimonial, index) => (
                        <View key={index} style={styles.testimonialCard}>
                            <MaterialIcons name="format-quote" size={24} color="#3498db" style={styles.quoteIcon} />
                            <Text style={styles.testimonialText}>{testimonial.text}</Text>
                            <Text style={styles.testimonialName}>- {testimonial.name}</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* CTA */}
                <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('Registro Negocios')}>
                    <Text style={styles.ctaText}>Registra tu negocio</Text>
                    <MaterialIcons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logoContainer: {
        width: width * 0.25,
        height: width * 0.25,
        borderRadius: width * 0.125,
        backgroundColor: '#e3f2fd',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: width * 0.08,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: width * 0.045,
        color: '#3498db',
        fontWeight: '600',
        marginBottom: 5,
    },
    tagline: {
        fontSize: width * 0.035,
        color: '#7f8c8d',
        fontStyle: 'italic',
    },
    banner: {
        backgroundColor: '#3498db',
        borderRadius: 10,
        padding: 20,
        marginVertical: 15,
        alignItems: 'center',
        position: 'relative',
    },
    bannerIcon: {
        position: 'absolute',
        left: 15,
        top: '50%',
        marginTop: -16,
    },
    bannerText: {
        color: 'white',
        fontSize: width * 0.05,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    bannerSubtext: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: width * 0.035,
    },
    sectionTitle: {
        fontSize: width * 0.055,
        fontWeight: '600',
        color: '#2c3e50',
        marginTop: 20,
        marginBottom: 15,
        marginLeft: 5,
    },
    featuresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    featureCard: {
        width: width * 0.43,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        backgroundColor: '#f1f8fe',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    featureTitle: {
        fontSize: width * 0.04,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 5,
    },
    featureDescription: {
        fontSize: width * 0.032,
        color: '#7f8c8d',
        lineHeight: 18,
    },
    testimonialsContainer: {
        marginBottom: 20,
    },
    testimonialCard: {
        width: width * 0.7,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginRight: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
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
    ctaButton: {
        backgroundColor: '#2E7D32',
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#2E7D32',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    ctaText: {
        color: 'white',
        fontSize: width * 0.04,
        fontWeight: '600',
        marginRight: 10,
    },
});
