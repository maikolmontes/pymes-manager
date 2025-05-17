import React, { useEffect, useState, useRef, useContext } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, TouchableOpacity,
  Animated, Platform, Pressable, Image, Modal, FlatList, Alert
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
    favorites?.some((f) => f.id === business_id || f.business_id === business_id);

  const handleToggleFavorite = async (business) => {
    if (!user || user.user_type !== 'Cliente') {
      Alert.alert('Solo los clientes pueden marcar favoritos');
      return;
    }

    try {
      const alreadyFavorite = favorites.find(f => f.business_id === business.id);

      if (alreadyFavorite) {
        await removeFavorite(user.id, business.id); // ← fix aquí
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
            />
          ))}
        </MapView>
      </Animated.View>

      {/* Drawer de negocio */}
      {selectedBusiness && (
        <Animated.View style={styles.drawer}>
          <View style={styles.drawerContent}>
            {selectedBusiness.image_url && (
              <Image source={{ uri: selectedBusiness.image_url }} style={styles.drawerImage} />
            )}
            <View style={styles.drawerTextContainer}>
              <Text style={styles.drawerTitle}>{selectedBusiness.name}</Text>
              <Text style={styles.drawerSubtitle}>{selectedBusiness.category}</Text>
              <Text style={styles.drawerDescription}>
                {selectedBusiness.description || 'Sin descripción'}
              </Text>
            </View>
            {user?.user_type === 'Cliente' && (
              <TouchableOpacity onPress={() => handleToggleFavorite(selectedBusiness)}>
                <Ionicons
                  name={isFavorite(selectedBusiness.id) ? 'heart' : 'heart-outline'}
                  size={28}
                  color="red"
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
            )}
          </View>
          <Pressable onPress={() => setSelectedBusiness(null)}>
            <Text style={styles.closeText}>Cerrar</Text>
          </Pressable>
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
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setFilterModalVisible(false)}>
              <Text style={styles.modalCloseButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1 },
  mapWrapper: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  drawer: {
    position: 'absolute', bottom: 0, width: '100%',
    backgroundColor: 'white', padding: 16,
    borderTopLeftRadius: 16, borderTopRightRadius: 16,
    elevation: 10,
  },
  drawerContent: { flexDirection: 'row', alignItems: 'center' },
  drawerImage: { width: 60, height: 60, borderRadius: 8, marginRight: 16 },
  drawerTextContainer: { flex: 1 },
  drawerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  drawerSubtitle: { fontSize: 14, color: '#2196F3' },
  drawerDescription: { fontSize: 13, color: '#444', marginTop: 6 },
  closeText: { color: 'red', textAlign: 'right', marginTop: 10, fontWeight: 'bold' },
  filterButtonContainer: {
    position: 'absolute', top: Platform.OS === 'ios' ? 60 : 30,
    left: 15, right: 15, zIndex: 20, alignItems: 'center',
  },
  filterButton: {
    backgroundColor: '#2196F3', paddingVertical: 10, paddingHorizontal: 25,
    borderRadius: 25, elevation: 5, alignItems: 'center',
  },
  filterButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  filterButtonSubText: { color: '#eee', fontSize: 12, marginTop: 2 },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white', borderRadius: 16,
    paddingVertical: 20, paddingHorizontal: 15, maxHeight: '80%',
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  modalLabel: { fontSize: 18, fontWeight: '600', marginVertical: 8 },
  categoryItem: {
    paddingVertical: 12, paddingHorizontal: 15,
    borderRadius: 8, borderWidth: 1, borderColor: '#ccc',
    marginBottom: 10,
  },
  selectedCategory: { backgroundColor: '#2196F3', borderColor: '#2196F3' },
  selectedCategoryText: { color: 'white', fontWeight: 'bold' },
  categoryText: { fontSize: 16, color: '#333' },
  modalCloseButton: {
    backgroundColor: '#2196F3', paddingVertical: 14,
    borderRadius: 12, marginTop: 20, alignItems: 'center',
  },
  modalCloseButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
