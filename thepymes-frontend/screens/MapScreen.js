import React, { useEffect, useState, useRef, useContext } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, TouchableOpacity,
  Animated, Platform, Pressable, Image, Modal, FlatList, Alert,
  Linking
} from 'react-native';
import Slider from '@react-native-community/slider';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { API_URL } from '@env';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import { addFavorite, removeFavorite, getFavoritesByUser } from '../services/favoriteService';

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const categories = ['Todas', 'Restaurante', 'Tienda', 'Cafetería', 'Supermercado', 'Mercado', 'Frutería', 'Ferretería', 'Farmacia', 'Librería', 'Ropa', 'Zapatería', 'Juguetería', 'Papelería', 'Barbería', 'Estética'];

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [negocios, setNegocios] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const mapRef = useRef(null);
  const { user, favorites, setFavorites } = useContext(UserContext);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [radiusFilter, setRadiusFilter] = useState(5);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'Se requiere acceso a la ubicación');
          setLoading(false);
          return;
        }

        const userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation.coords);
        console.log('📍 Ubicación del usuario:', userLocation.coords);

        await fetchBusinesses();

        if (user?.id && user.user_type === 'Cliente') {
          const favs = await getFavoritesByUser(user.id);
          setFavorites(favs);
          console.log('❤️ Favoritos cargados:', favs);
        }

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error('❌ Error en useEffect:', error);
        setLoading(false);
      }
    })();
  }, [user]);

  const fetchBusinesses = async () => {
    try {
      const res = await axios.get(`${API_URL}/businesses`);
      setNegocios(res.data);
      console.log('📊 Negocios obtenidos:', res.data);
    } catch (error) {
      console.error('❌ Error al cargar negocios:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (business_id) =>
    favorites?.some((f) => f.business_id === business_id);

  const handleToggleFavorite = async (business) => {
    if (!user || user.user_type !== 'Cliente') {
      Alert.alert('Solo los clientes pueden marcar favoritos');
      return;
    }

    try {
      const existing = favorites.find(f => f.business_id === business.id);

      if (existing) {
        await removeFavorite(user.id, business.id);
      } else {
        await addFavorite(user.id, business.id);
      }

      const updated = await getFavoritesByUser(user.id);
      setFavorites(updated);
    } catch (error) {
      console.error('❌ Error al actualizar favoritos:', error);
      Alert.alert('Error', 'No se pudo actualizar favoritos');
    }
  };

  const handleOpenInMaps = () => {
    if (selectedBusiness) {
      const { latitude, longitude, name } = selectedBusiness;
      const url = Platform.select({
        ios: `maps://?q=${name}&ll=${latitude},${longitude}`,
        android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(name)})`
      });

      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          // Si no hay aplicación de mapas, abrir en Google Maps web
          const browserUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${encodeURIComponent(name)}`;
          return Linking.openURL(browserUrl);
        }
      }).catch(err => {
        console.error('Error al abrir mapa:', err);
        Alert.alert('Error', 'No se pudo abrir la aplicación de mapas');
      });
    }
  };

  const filteredBusinesses = negocios.filter((b) => {
    if (!b.latitude || !b.longitude) return false;
    if (categoryFilter && categoryFilter !== 'Todas' && b.category !== categoryFilter) return false;
    if (location) {
      const dist = getDistanceFromLatLonInKm(location.latitude, location.longitude, b.latitude, b.longitude);
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
      {/* Botón filtro */}
      <View style={styles.filterButtonContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
          <Text style={styles.filterButtonText}>Filtro</Text>
          <Text style={styles.filterButtonSubText}>{categoryFilter || 'Todas'} | {radiusFilter} km</Text>
        </TouchableOpacity>
      </View>

      {/* Mapa */}
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
          {filteredBusinesses.map((b) => (
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
              <Image source={{ uri: selectedBusiness.image_url }} style={styles.cardImage} />
            )}
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>{selectedBusiness.name}</Text>
              <Text style={styles.cardSubtitle}>{selectedBusiness.category}</Text>
            </View>
            {user?.user_type === 'Cliente' && (
              <TouchableOpacity 
                onPress={() => handleToggleFavorite(selectedBusiness)}
                style={styles.favoriteButton}
              >
                <Ionicons
                  name={isFavorite(selectedBusiness.id) ? 'heart' : 'heart-outline'}
                  size={28}
                  color="red"
                />
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={styles.cardDescription}>
            {selectedBusiness.description || 'Sin descripción'}
          </Text>
          
          <View style={styles.cardButtonsContainer}>
            <TouchableOpacity 
              style={styles.locationButton}
              onPress={handleOpenInMaps}
            >
              <Ionicons name="map" size={20} color="white" />
              <Text style={styles.locationButtonText}>Abrir en Maps</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedBusiness(null)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Modal de filtros */}
      <Modal visible={filterModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar Negocios</Text>
            <Text style={styles.modalLabel}>Categoría</Text>
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              extraData={categoryFilter}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    item === (categoryFilter || 'Todas') ? styles.selectedCategory : null,
                  ]}
                  onPress={() => setCategoryFilter(item === 'Todas' ? null : item)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      item === (categoryFilter || 'Todas') ? styles.selectedCategoryText : null,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <Text style={styles.modalLabel}>Radio: {radiusFilter} km</Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={1}
              maximumValue={20}
              step={1}
              value={radiusFilter}
              onValueChange={setRadiusFilter}
              minimumTrackTintColor="#2196F3"
              maximumTrackTintColor="#000"
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
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mapWrapper: { 
    flex: 1,
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  businessCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
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
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
  },
  locationButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 16,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#555',
    fontWeight: '600',
    fontSize: 16,
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
  },
  filterButtonContainer: {
    position: 'absolute', 
    top: Platform.OS === 'ios' ? 60 : 30,
    left: 20, 
    right: 20, 
    zIndex: 20,
    alignItems: 'center',
  },
  filterButton: {
    backgroundColor: '#2196F3', 
    paddingVertical: 10, 
    paddingHorizontal: 25,
    borderRadius: 25, 
    elevation: 5, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  filterButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold',
  },
  filterButtonSubText: { 
    color: '#eee', 
    fontSize: 12, 
    marginTop: 2,
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
    fontSize: 18, 
    fontWeight: '600', 
    marginVertical: 8,
    color: '#555',
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
  modalCloseButton: {
    backgroundColor: '#2196F3', 
    paddingVertical: 14,
    borderRadius: 12, 
    marginTop: 20, 
    alignItems: 'center',
  },
  modalCloseButtonText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16,
  },
});