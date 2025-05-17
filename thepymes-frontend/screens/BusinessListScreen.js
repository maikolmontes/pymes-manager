// screens/BusinessListScreen.js
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@env';
import { UserContext } from '../context/UserContext';

const { width } = Dimensions.get('window');

export default function BusinessListScreen() {
  const { user } = useContext(UserContext);
  const [negocios, setNegocios] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarSoloFavoritos, setMostrarSoloFavoritos] = useState(false);

  const esCliente = user?.user_type === 'Cliente';

  useEffect(() => {
    fetchBusinesses();
    if (esCliente) fetchFavorites();
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

  const fetchFavorites = async () => {
    try {
      const res = await axios.get(`${API_URL}/favorites/${user.id}`);
      const ids = res.data.map((fav) => fav.business_id);
      setFavoritos(ids);
    } catch (error) {
      console.error('❌ Error al obtener favoritos:', error);
    }
  };

  const toggleFavorite = async (businessId) => {
    try {
      const isFav = favoritos.includes(businessId);
      if (isFav) {
        await axios.delete(`${API_URL}/favorites/${user.id}/${businessId}`);
        setFavoritos((prev) => prev.filter((id) => id !== businessId));
      } else {
        await axios.post(`${API_URL}/favorites`, {
          user_id: user.id,
          business_id: businessId,
        });
        setFavoritos((prev) => [...prev, businessId]);
      }
    } catch (error) {
      console.error('❌ Error al actualizar favoritos:', error);
    }
  };

  const negociosFiltrados = mostrarSoloFavoritos
    ? negocios.filter((n) => favoritos.includes(n.id))
    : negocios;

  const renderItem = ({ item }) => {
    const isFav = favoritos.includes(item.id);

    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.9}>
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

        {esCliente && (
          <TouchableOpacity
            onPress={() => toggleFavorite(item.id)}
            style={styles.favoriteIcon}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={24}
              color={isFav ? '#e91e63' : '#aaa'}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={{ marginTop: 10 }}>Cargando negocios...</Text>
      </View>
    );
  }

  if (negociosFiltrados.length === 0) {
    return (
      <View style={styles.center}>
        <Text>
          {mostrarSoloFavoritos
            ? 'No has marcado favoritos todavía.'
            : 'No hay negocios disponibles.'}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {esCliente && (
        <View style={styles.filterBar}>
          <TouchableOpacity
            onPress={() => setMostrarSoloFavoritos(!mostrarSoloFavoritos)}
            style={[
              styles.filtroButton,
              mostrarSoloFavoritos && styles.filtroButtonActivo,
            ]}
          >
            <Ionicons
              name={mostrarSoloFavoritos ? 'heart' : 'heart-outline'}
              size={20}
              color={mostrarSoloFavoritos ? '#fff' : '#e91e63'}
            />
            <Text
              style={[
                styles.filtroText,
                mostrarSoloFavoritos && { color: '#fff' },
              ]}
            >
              {mostrarSoloFavoritos ? 'Ver todos' : 'Ver favoritos'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={negociosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
    alignItems: 'center',
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
    padding: 10,
    marginRight: 8,
  },
  filterBar: {
    padding: 10,
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  filtroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#ffeef2',
    borderRadius: 20,
  },
  filtroButtonActivo: {
    backgroundColor: '#e91e63',
  },
  filtroText: {
    marginLeft: 6,
    color: '#e91e63',
    fontWeight: '600',
  },
});
