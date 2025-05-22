// Este es un borrador base para la pantalla EditBusinessScreen basado en RegisterBusinessScreen
// El usuario debe tener su backend configurado con la ruta PUT /businesses/:id

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_URL } from '@env';
import axios from 'axios';

export default function EditBusinessScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { business } = route.params;

  const [name, setName] = useState(business.name);
  const [category, setCategory] = useState(business.category);
  const [latitude, setLatitude] = useState(business.latitude.toString());
  const [longitude, setLongitude] = useState(business.longitude.toString());
  const [description, setDescription] = useState(business.description);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Se necesita acceso a la galería');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    if (!name || !category || !latitude || !longitude || !description) {
      Alert.alert('Campos incompletos', 'Completa todos los campos');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('description', description);

    if (image) {
      const filename = image.split('/').pop();
      const ext = /\.(\w+)$/.exec(filename)?.[1] || 'jpg';
      formData.append('image', {
        uri: image,
        name: `foto.${ext}`,
        type: `image/${ext}`,
      });
    }

    try {
      setLoading(true);
      await axios.put(`${API_URL}/businesses/${business.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert('Éxito', 'Negocio actualizado');
      navigation.goBack();
    } catch (error) {
      console.error('❌ Error al actualizar:', error);
      Alert.alert('Error', 'No se pudo actualizar el negocio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Negocio</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del negocio"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Categoría"
        value={category}
        onChangeText={setCategory}
      />

      <TextInput
        style={styles.input}
        placeholder="Latitud"
        value={latitude}
        onChangeText={setLatitude}
      />

      <TextInput
        style={styles.input}
        placeholder="Longitud"
        value={longitude}
        onChangeText={setLongitude}
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.buttonSecondary} onPress={pickImage}>
        <Text style={styles.buttonText}>Cambiar imagen</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Guardar cambios</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#2196F3" />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f4f4f4' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonSecondary: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
});

