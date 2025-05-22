import React, { useEffect, useState, useContext } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput,
  TouchableOpacity, Alert, Image, Modal
} from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { API_URL } from '@env';
import { UserContext } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  'Restaurante', 'Tienda', 'Cafetería', 'Supermercado',
  'Mercado', 'Frutería', 'Ferretería', 'Farmacia', 'Librería',
  'Ropa', 'Zapatería', 'Juguetería', 'Papelería', 'Barbería', 'Estética',
];

export default function EditBusinessScreen() {
  const { user } = useContext(UserContext);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [form, setForm] = useState({
    name: '', category: '', description: '', image: null,
  });

  useEffect(() => {
    if (user?.user_type === 'Emprendedor') {
      fetchMyBusinesses();
    }
  }, []);

  const fetchMyBusinesses = async () => {
    try {
      const res = await axios.get(`${API_URL}/businesses/my/${user.id}`);
      setBusinesses(res.data);
    } catch (error) {
      console.error('❌ Error al cargar negocios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (business) => {
    setSelected(business);
    setForm({
      name: business.name,
      category: business.category,
      description: business.description,
      image: business.image_url || null,
    });
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Se necesita acceso a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setForm({ ...form, image: result.assets[0].uri });
    }
  };

  const handleUpdate = async () => {
    if (!form.name || !form.category || !form.description) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    const data = new FormData();
    data.append('name', form.name);
    data.append('category', form.category);
    data.append('description', form.description);

    if (form.image && !form.image.startsWith('http')) {
      const filename = form.image.split('/').pop();
      const ext = /\.(\w+)$/.exec(filename)?.[1] || 'jpg';
      data.append('image', {
        uri: form.image,
        name: `imagen.${ext}`,
        type: `image/${ext}`,
      });
    }

    try {
      await axios.put(`${API_URL}/businesses/${selected.id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert('✅ Éxito', 'Negocio actualizado correctamente');
      setSelected(null);
      fetchMyBusinesses();
    } catch (error) {
      console.error('❌ Error al actualizar:', error.message);
      Alert.alert('Error', 'No se pudo actualizar el negocio');
    }
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#2196F3" />
      <Text>Cargando tus negocios...</Text>
    </View>
  );

  if (selected) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Editar Negocio</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={form.name}
          onChangeText={text => setForm({ ...form, name: text })}
        />

        <TouchableOpacity
          style={styles.input}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Text style={{ color: '#333' }}>
            {form.category || 'Seleccionar categoría'}
          </Text>
        </TouchableOpacity>

        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Descripción"
          value={form.description}
          multiline
          onChangeText={text => setForm({ ...form, description: text })}
        />

        {form.image && (
          <Image
            source={{ uri: form.image }}
            style={styles.imagePreview}
          />
        )}

        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.imageButtonText}>🖼️ Cambiar Imagen</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
          <Text style={styles.saveText}>Guardar Cambios</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => setSelected(null)}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>

        {/* Modal de categorías */}
        <Modal
          visible={categoryModalVisible}
          animationType="slide"
          transparent
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecciona una categoría</Text>
              <FlatList
                data={categories}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.categoryItem}
                    onPress={() => {
                      setForm({ ...form, category: item });
                      setCategoryModalVisible(false);
                    }}
                  >
                    <Text style={styles.categoryText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity onPress={() => setCategoryModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Negocios</Text>
      <FlatList
        data={businesses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleEdit(item)}>
            <Image source={{ uri: item.image_url }} style={styles.cardImage} />
            <View style={styles.cardText}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.description}>
                {item.description?.substring(0, 80) || 'Sin descripción'}...
              </Text>
            </View>
            <Ionicons name="create-outline" size={24} color="#2196F3" style={{ marginRight: 10 }} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f4f4f4', flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: {
    backgroundColor: '#fff', padding: 12, marginBottom: 12,
    borderRadius: 8, fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#2196F3', padding: 14,
    borderRadius: 8, alignItems: 'center', marginBottom: 12,
  },
  saveText: { color: '#fff', fontWeight: 'bold' },
  cancelButton: {
    padding: 12, borderRadius: 8,
    backgroundColor: '#ccc', alignItems: 'center',
  },
  cancelText: { color: '#000', fontWeight: 'bold' },
  imagePreview: {
    width: '100%', height: 200, marginBottom: 12,
    borderRadius: 12, resizeMode: 'cover',
  },
  imageButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  imageButtonText: { color: '#fff', fontWeight: 'bold' },
  card: {
    flexDirection: 'row', backgroundColor: '#fff',
    marginBottom: 12, borderRadius: 10, overflow: 'hidden',
    alignItems: 'center',
  },
  cardImage: {
    width: 60, height: 60, margin: 10, borderRadius: 8,
  },
  cardText: { flex: 1 },
  name: { fontWeight: 'bold', fontSize: 16 },
  category: { color: '#2196F3', fontSize: 14 },
  description: { color: '#555', fontSize: 13, marginTop: 4 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
