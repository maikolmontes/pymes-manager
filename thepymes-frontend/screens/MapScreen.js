import React, { useEffect, useState, useRef, useContext } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, TouchableOpacity,
  Animated, Platform, Image, Modal, FlatList, Alert,
  Linking, Dimensions
} from 'react-native';
import Slider from '@react-native-community/slider';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { API_URL } from '@env';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import { addFavorite, removeFavorite, getFavoritesByUser } from '../services/favoriteService';
import { WebView } from 'react-native-webview';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const toRad = value => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const categories = [
  'Todas', 'Restaurante', 'Tienda', 'Cafetería', 'Supermercado', 
  'Mercado', 'Frutería', 'Ferretería', 'Farmacia', 'Librería', 
  'Ropa', 'Zapatería', 'Juguetería', 'Papelería', 'Barbería', 'Estética'
];

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [negocios, setNegocios] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [streetViewVisible, setStreetViewVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const mapRef = useRef(null);
  const { user, favorites, setFavorites } = useContext(UserContext);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [radiusFilter, setRadiusFilter] = useState(5);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'Se requiere acceso a la ubicación');
          setLoading(false);
          return;
        }

        const userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation.coords);

        await fetchBusinesses();

        if (user?.id && user.user_type === 'Cliente') {
          const favs = await getFavoritesByUser(user.id);
          setFavorites(favs);
        }

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error('Error al obtener ubicación:', error);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      // Limpieza si es necesaria
    };
  }, [user]);

  const fetchBusinesses = async () => {
    try {
      const res = await axios.get(`${API_URL}/businesses`);
      setNegocios(res.data);
    } catch (error) {
      console.error('Error al cargar negocios:', error);
      Alert.alert('Error', 'No se pudieron cargar los negocios');
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = businessId => favorites?.some(f => f.business_id === businessId);

  const handleToggleFavorite = async business => {
    if (!user || user.user_type !== 'Cliente') {
      Alert.alert('Acción no permitida', 'Solo los clientes pueden marcar favoritos');
      return;
    }

    try {
      if (isFavorite(business.id)) {
        await removeFavorite(user.id, business.id);
      } else {
        await addFavorite(user.id, business.id);
      }

      const updated = await getFavoritesByUser(user.id);
      setFavorites(updated);
    } catch (error) {
      console.error('Error al actualizar favoritos:', error);
      Alert.alert('Error', 'No se pudo actualizar favoritos');
    }
  };

  const handleOpenInMaps = () => {
    if (!selectedBusiness) return;

    const { latitude, longitude, name } = selectedBusiness;
    const url = Platform.select({
      ios: `maps://?q=${name}&ll=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(name)})`
    });

    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          const browserUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${encodeURIComponent(name)}`;
          return Linking.openURL(browserUrl);
        }
      })
      .catch(err => {
        console.error('Error al abrir mapa:', err);
        Alert.alert('Error', 'No se pudo abrir la aplicación de mapas');
      });
  };

  const openStreetView = () => {
    if (!selectedBusiness) return;
    setStreetViewVisible(true);
  };

  const closeStreetView = () => {
    setStreetViewVisible(false);
  };

  const filteredBusinesses = negocios.filter(b => {
    if (!b.latitude || !b.longitude) return false;
    if (categoryFilter && categoryFilter !== 'Todas' && b.category !== categoryFilter) return false;
    if (location) {
      const dist = getDistanceFromLatLonInKm(
        location.latitude,
        location.longitude,
        b.latitude,
        b.longitude
      );
      if (dist > radiusFilter) return false;
    }
    return true;
  });

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
      {/* Botón de filtro */}
      <TouchableOpacity 
        style={styles.filterButton} 
        onPress={() => setFilterModalVisible(true)}
      >
        <Ionicons name="filter" size={20} color="white" />
        <Text style={styles.filterButtonText}>
          {categoryFilter || 'Todas'} | {radiusFilter} km
        </Text>
      </TouchableOpacity>

      {/* Mapa principal */}
      <Animated.View style={[styles.mapWrapper, { opacity: fadeAnim }]}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation
          showsMyLocationButton={false}
          showsBuildings
          showsTraffic
          showsIndoors
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          }}
        >
          {filteredBusinesses.map(b => (
            <Marker
              key={b.id}
              coordinate={{ latitude: b.latitude, longitude: b.longitude }}
              onPress={() => setSelectedBusiness(b)}
            >
              <View style={[
                styles.markerContainer,
                selectedBusiness?.id === b.id && styles.selectedMarker
              ]}>
                <Ionicons 
                  name="business" 
                  size={24} 
                  color={selectedBusiness?.id === b.id ? '#2196F3' : '#555'} 
                />
              </View>
            </Marker>
          ))}
        </MapView>
      </Animated.View>

      {/* Tarjeta de negocio seleccionado */}
      {selectedBusiness && (
        <Animated.View style={styles.businessCard}>
          <View style={styles.cardHeader}>
            {selectedBusiness.image_url && (
              <Image 
                source={{ uri: selectedBusiness.image_url }} 
                style={styles.cardImage} 
                resizeMode="cover"
              />
            )}
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle} numberOfLines={1}>{selectedBusiness.name}</Text>
              <Text style={styles.cardSubtitle}>{selectedBusiness.category}</Text>
              {location && (
                <Text style={styles.distanceText}>
                  {getDistanceFromLatLonInKm(
                    location.latitude,
                    location.longitude,
                    selectedBusiness.latitude,
                    selectedBusiness.longitude
                  ).toFixed(2)} km
                </Text>
              )}
            </View>
            {user?.user_type === 'Cliente' && (
              <TouchableOpacity 
                onPress={() => handleToggleFavorite(selectedBusiness)}
                style={styles.favoriteButton}
              >
                <Ionicons
                  name={isFavorite(selectedBusiness.id) ? 'heart' : 'heart-outline'}
                  size={28}
                  color={isFavorite(selectedBusiness.id) ? 'red' : '#555'}
                />
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={styles.cardDescription} numberOfLines={3}>
            {selectedBusiness.description || 'Sin descripción'}
          </Text>
          
          <View style={styles.cardButtonsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.mapButton]}
              onPress={handleOpenInMaps}
            >
              <Ionicons name="map" size={18} color="white" />
              <Text style={styles.actionButtonText}>Mapa</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.streetViewButton]}
              onPress={openStreetView}
            >
              <Ionicons name="globe" size={18} color="white" />
              <Text style={styles.actionButtonText}>360°</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.closeButton]}
              onPress={() => setSelectedBusiness(null)}
            >
              <Text style={styles.actionButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Modal de Google Street View - Versión actualizada con WebView */}
      <Modal
        visible={streetViewVisible}
        animationType="slide"
        onRequestClose={closeStreetView}
      >
        <View style={styles.streetViewContainer}>
          {selectedBusiness && (
            <WebView
              source={{
                html: `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta 
                        name="viewport" 
                        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
                      >
                      <style>
                        body, html { 
                          margin: 0; 
                          padding: 0; 
                          width: 100%; 
                          height: 100%; 
                          overflow: hidden; 
                        }
                        iframe { 
                          position: absolute; 
                          top: 0; 
                          left: 0; 
                          width: 100%; 
                          height: 100%; 
                          border: none; 
                        }
                      </style>
                    </head>
                    <body>
                      <iframe
                        src="https://www.google.com/maps/embed/v1/streetview?key=AIzaSyDUEn0BxYEelwx7cFrdQug1lX-Ul71wfmw&location=${selectedBusiness.latitude},${selectedBusiness.longitude}&heading=210&pitch=10&fov=90"
                        allowfullscreen
                      ></iframe>
                    </body>
                  </html>
                `
              }}
              style={{ flex: 1 }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#2196F3" />
                  <Text style={{ color: 'white', marginTop: 10 }}>Cargando vista 360°...</Text>
                </View>
              )}
            />
          )}
          <TouchableOpacity 
            style={styles.closeStreetViewButton}
            onPress={closeStreetView}
          >
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal de filtros */}
      <Modal 
        visible={filterModalVisible} 
        transparent 
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar Negocios</Text>
            
            <Text style={styles.modalLabel}>Categoría</Text>
            <FlatList
              data={categories}
              keyExtractor={item => item}
              extraData={categoryFilter}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    item === (categoryFilter || 'Todas') && styles.selectedCategory,
                  ]}
                  onPress={() => setCategoryFilter(item === 'Todas' ? null : item)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      item === (categoryFilter || 'Todas') && styles.selectedCategoryText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.categoryList}
            />
            
            <Text style={styles.modalLabel}>Radio: {radiusFilter} km</Text>
            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={20}
              step={0.5}
              value={radiusFilter}
              onValueChange={setRadiusFilter}
              minimumTrackTintColor="#2196F3"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#2196F3"
            />
            
            <TouchableOpacity 
              style={styles.modalCloseButton} 
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Aplicar Filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mapWrapper: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  filterButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    zIndex: 20,
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  filterButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
  businessCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#2196F3',
    marginTop: 2,
  },
  distanceText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  favoriteButton: {
    marginLeft: 10,
    padding: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
    lineHeight: 20,
  },
  cardButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  mapButton: {
    backgroundColor: '#2196F3',
  },
  streetViewButton: {
    backgroundColor: '#4CAF50',
  },
  closeButton: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  markerContainer: {
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 3,
  },
  selectedMarker: {
    borderColor: '#2196F3',
    borderWidth: 2,
    transform: [{ scale: 1.1 }],
  },
  streetViewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeStreetViewButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 15,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8,
    color: '#555',
  },
  categoryList: {
    paddingBottom: 10,
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  selectedCategory: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MapScreen;