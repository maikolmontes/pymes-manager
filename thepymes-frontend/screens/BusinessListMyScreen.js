import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@env';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import { addFavorite, removeFavorite, getFavoritesByUser } from '../services/favoriteService';

const { width } = Dimensions.get('window');

const categories = [
  'Todas', 'Restaurante', 'Tienda', 'Cafetería', 'Supermercado', 'Mercado',
  'Frutería', 'Ferretería', 'Farmacia', 'Librería', 'Ropa',
  'Zapatería', 'Juguetería', 'Papelería', 'Barbería', 'Estética',
];

export default function BusinessListMyScreen() {
  const [negocios, setNegocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, favorites, setFavorites } = useContext(UserContext);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      if (user?.id) {
        fetchMyBusinesses();
        fetchFavorites();
      }
    }, [user])
  );

  const fetchMyBusinesses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/businesses/my/${user.id}`);
setNegocios(res.data);
    } catch (error) {
      console.error('❌ Error al cargar negocios del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const favs = await getFavoritesByUser(user.id);
      setFavorites(favs);
    } catch (error) {
      console.error('❌ Error al cargar favoritos:', error);
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
      fetchFavorites();
    } catch (error) {
      console.error('❌ Error al actualizar favoritos:', error);
    }
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
      </View>
      {(user?.user_type === 'Cliente' || user?.user_type === 'Emprendedor') && (
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
        <Text style={{ marginTop: 10 }}>Cargando tus negocios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
              <Text
                style={[
                  styles.categoryText,
                  categoryFilter === cat ? styles.categoryTextActive : null,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

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
});
