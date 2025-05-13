import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
    Platform,
    Animated,
    Pressable,
    Image,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { API_URL } from '@env';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [negocios, setNegocios] = useState([]);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const mapRef = useRef(null);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permiso denegado para acceder a la ubicación.');
                setLoading(false);
                return;
            }

            const userLocation = await Location.getCurrentPositionAsync({});
            setLocation(userLocation.coords);
            fetchBusinesses();

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }).start();
        })();
    }, []);

    const fetchBusinesses = async () => {
        try {
            const res = await axios.get(`${API_URL}/businesses`);
            setNegocios(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar negocios:', error);
            setLoading(false);
        }
    };

    const handleMarkerPress = (business) => {
        setSelectedBusiness(business);
    };

    const closeDrawer = () => setSelectedBusiness(null);

    if (loading || !location) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text>Cargando mapa...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.mapWrapper, { opacity: fadeAnim }]}>
                <MapView
                    ref={mapRef}
                    style={StyleSheet.absoluteFillObject}
                    showsUserLocation
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.03,
                        longitudeDelta: 0.03,
                    }}
                >
                    {negocios.map((b) => (
                        <Marker
                            key={b.id}
                            coordinate={{ latitude: b.latitude, longitude: b.longitude }}
                            onPress={() => handleMarkerPress(b)}
                            tracksViewChanges={true}
                        />
                    ))}
                </MapView>
            </Animated.View>

            {selectedBusiness && (
                <Animated.View style={styles.drawer}>
                    <View style={styles.drawerContent}>
                        {selectedBusiness.image_url && (
                            <Image
                                source={{ uri: selectedBusiness.image_url }}
                                style={styles.drawerImage}
                            />
                        )}
                        <View style={styles.drawerTextContainer}>
                            <Text style={styles.drawerTitle}>{selectedBusiness.name}</Text>
                            <Text style={styles.drawerSubtitle}>{selectedBusiness.category}</Text>
                            <Text style={styles.drawerDescription}>
                                {selectedBusiness.description || 'Sin descripción disponible'}
                            </Text>
                        </View>
                    </View>
                    <Pressable onPress={closeDrawer}>
                        <Text style={styles.closeText}>Cerrar</Text>
                    </Pressable>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mapWrapper: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    drawer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 10,
    },
    drawerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    drawerImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 16,
    },
    drawerTextContainer: {
        flex: 1,
    },
    drawerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    drawerSubtitle: {
        fontSize: 14,
        color: '#2196F3',
    },
    drawerDescription: {
        fontSize: 13,
        color: '#444',
        marginTop: 6,
    },
    closeText: {
        color: 'red',
        textAlign: 'right',
        marginTop: 10,
        fontWeight: 'bold',
    },
});
