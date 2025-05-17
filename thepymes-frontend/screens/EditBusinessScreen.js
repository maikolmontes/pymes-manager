import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@env';

const categories = [
  'Restaurante', 'Tienda', 'Cafetería', 'Supermercado', 'Mercado',
  'Frutería', 'Ferretería', 'Farmacia', 'Librería', 'Ropa',
  'Zapatería', 'Juguetería', 'Papelería', 'Barbería', 'Estética',
];

export default function EditBusinessScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { business } = route.params;

  const [name, setName] = useState(business.name);
  const [category, setCategory] = useState(business.category);
  const [latitude, setLatitude] = useState(business.latitude.toString());
  const [longitude, setLongitude] = useState(business.longitude.toString());
  const [description, setDescription] = useState(business.description || '');
  const [image, setImage] = useState(business.image_url || null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newImageSelected, setNewImageSelected] = useState(false);

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
      setImage(result.assets[0].uri);
      setNewImageSelected(true);
    }
  };

  const handleUpdate = async () => {
    if (!name || !category || !latitude || !longitude) {
      Alert.alert('Campos incompletos', 'Todos los campos son obligatorios');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('category', category);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('description', description);

      if (newImageSelected && image) {
        const filename = image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const ext = match ? match[1] : 'jpg';
        formData.append('image', {
          uri: image,
          name: `image.${ext}`,
          type: `image/${ext}`,
        });
      }

      await axios.put(`${API_URL}/businesses/${business.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Éxito', 'Negocio actualizado correctamente');
      navigation.goBack();
    } catch (error) {
      console.error('❌ Error al actualizar negocio:', error.message);
      Alert.alert('Error', 'No se pudo actualizar el negocio');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Negocio</Text>

      <TouchableOpacity style={styles.inputContainer} onPress={() => setModalVisible(true)}>
        <Ionicons name="pricetag" size={20} color="#666" style={styles.icon} />
        <Text style={styles.input}>{category || 'Selecciona una categoría'}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={categories}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => {
                    setCategory(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.categoryText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.inputContainer}>
        <Ionicons name="business" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nombre del negocio"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="locate" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Latitud"
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="decimal-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="locate" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Longitud"
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="decimal-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="document-text" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.buttonText}>🖼️ Cambiar Imagen</Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image }} style={{ width: '100%', height: 200, marginTop: 10, borderRadius: 10 }} />
      )}

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>💾 Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f4f6f8' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  button: {
    backgroundColor: '#2E86DE',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  imageButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center',
  },
  modalContent: {
    width: 300, backgroundColor: '#fff',
    padding: 20, borderRadius: 12,
  },
  categoryItem: { paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ddd' },
  categoryText: { fontSize: 16, color: '#333' },
  closeButton: {
    marginTop: 20, backgroundColor: '#2196F3',
    paddingVertical: 10, borderRadius: 12, alignItems: 'center',
  },
  closeButtonText: { color: '#fff', fontWeight: 'bold' },
});
