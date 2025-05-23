import React, { useEffect, useState, useContext } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  Image, Dimensions, TouchableOpacity, ScrollView, Linking, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@env';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { addFavorite, removeFavorite, getFavoritesByUser } from '../services/favoriteService';

const { width } = Dimensions.get('window');

const categories = [
  'Todas', 'Restaurante', 'Tienda', 'Cafetería', 'Supermercado', 'Mercado',
  'Frutería', 'Ferretería', 'Farmacia', 'Librería', 'Ropa',
  'Zapatería', 'Juguetería', 'Papelería', 'Barbería', 'Estética',
];

export default function BusinessListScreen() {
  const [negocios, setNegocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, favorites, setFavorites } = useContext(UserContext);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(null);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const res = await axios.get(`${API_URL}/businesses`);
      setNegocios(res.data);
    } catch (error) {
      console.error('❌ Error al cargar negocios:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (business_id) =>
    favorites?.some((f) => f.business_id === business_id);

  const handleToggleFavorite = async (business) => {
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
    }
  };

  // Función para abrir ubicación en Google Maps
  const openLocationInMaps = (lat, lng, name) => {
    const url = Platform.select({
      ios: `maps://?q=${name}&ll=${lat},${lng}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}(${name})`,
      default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    });

    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
      }
    });
  };

  const filteredBusinesses = negocios.filter((b) => {
    if (categoryFilter && categoryFilter !== 'Todas' && b.category !== categoryFilter) return false;
    if (showOnlyFavorites && !isFavorite(b.id)) return false;
    return true;
  });

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={{ color: '#999' }}>Sin imagen</Text>
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.description}>
          {item.description?.substring(0, 100) || 'Sin descripción'}...
        </Text>
        
        {/* Botón para abrir ubicación */}
        {item.latitude && item.longitude && (
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={() => openLocationInMaps(item.latitude, item.longitude, item.name)}
          >
            <Ionicons name="location-outline" size={16} color="#2196F3" />
            <Text style={styles.locationText}>Ver ubicación</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Botón de favoritos (sin cambios) */}
      {user?.user_type === 'Cliente' && (
        <TouchableOpacity onPress={() => handleToggleFavorite(item)} style={styles.favoriteIcon}>
          <Ionicons
            name={isFavorite(item.id) ? 'heart' : 'heart-outline'}
            size={24}
            color="red"
          />
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={{ marginTop: 10 }}>Cargando negocios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filtros */}
      <View style={styles.filtroTop}>
        <TouchableOpacity
          onPress={() => setShowOnlyFavorites(!showOnlyFavorites)}
          style={[styles.favToggle, showOnlyFavorites && styles.favToggleActive]}
        >
          <Ionicons name="heart" size={18} color={showOnlyFavorites ? '#fff' : '#2196F3'} />
          <Text style={[styles.favToggleText, showOnlyFavorites && { color: '#fff' }]}>
            Ver favoritos
          </Text>
        </TouchableOpacity>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                categoryFilter === cat ? styles.categoryButtonActive : null,
              ]}
              onPress={() => setCategoryFilter(cat === 'Todas' ? null : cat)}
            >
              <Text style={[
                styles.categoryText,
                categoryFilter === cat ? styles.categoryTextActive : null,
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista */}
      <FlatList
        data={filteredBusinesses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filtroTop: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#0A0A23',
  },
  favToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
  },
  favToggleActive: {
    backgroundColor: '#2196F3',
  },
  favToggleText: {
    marginLeft: 6,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  categoryScroll: {
    paddingBottom: 5,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    backgroundColor: '#fff',
  },
  categoryButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    position: 'relative',
  },
  image: {
    width: width * 0.25,
    height: width * 0.25,
  },
  imagePlaceholder: {
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  category: {
    color: '#2196F3',
    fontSize: 14,
    marginTop: 4,
  },
  description: {
    fontSize: 13,
    color: '#555',
    marginTop: 6,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  // Estilos para el botón de ubicación
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationText: {
    marginLeft: 4,
    color: '#2196F3',
    fontSize: 14,
  },
});