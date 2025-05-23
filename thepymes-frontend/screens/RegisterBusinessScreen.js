// 👇🏻 CAMBIOS AQUÍ
import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  Modal as RNModal, FlatList, Alert, KeyboardAvoidingView, Platform,
  Image, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import Modal from 'react-native-modal';
import axios from 'axios';
import { API_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../context/UserContext'; // ✅ Importar contexto

export default function RegisterBusinessScreen() {
  const navigation = useNavigation();
  const { user } = useContext(UserContext); // ✅ Obtener desde contexto

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);

  const categories = [
    'Restaurante', 'Tienda', 'Cafetería', 'Supermercado', 'Mercado',
    'Frutería', 'Ferretería', 'Farmacia', 'Librería', 'Ropa',
    'Zapatería', 'Juguetería', 'Papelería', 'Barbería', 'Estética',
  ];

  useEffect(() => {
    if (!user || user.user_type !== 'Emprendedor') {
      Alert.alert('Acceso denegado', 'Solo los emprendedores pueden registrar negocios');
      navigation.goBack();
    }

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({});
      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Se necesita acceso a la galería para subir una imagen');
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
    }
  };

  const handleUseCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se requiere acceso a la ubicación');
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    setLatitude(location.coords.latitude.toString());
    setLongitude(location.coords.longitude.toString());
    setSelectedLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    });
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const confirmLocation = () => {
    if (selectedLocation) {
      setLatitude(selectedLocation.latitude.toString());
      setLongitude(selectedLocation.longitude.toString());
    }
    setMapModalVisible(false);
  };

  const handleRegister = async () => {
    if (!name || !category || !latitude || !longitude || !description || !image) {
      Alert.alert('Campos incompletos', 'Todos los campos son obligatorios');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('description', description);
    formData.append('user_id', user.id);

    const filename = image.split('/').pop();
    const ext = /\.(\w+)$/.exec(filename)?.[1] || 'jpg';

    formData.append('image', {
      uri: image,
      name: `foto.${ext}`,
      type: `image/${ext}`,
    });

    try {
      setLoading(true);
      await axios.post(`${API_URL}/businesses`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);

      setName('');
      setCategory('');
      setLatitude('');
      setLongitude('');
      setDescription('');
      setImage(null);
      setSelectedLocation(null);
    } catch (error) {
      setLoading(false);
      console.error('Error al registrar:', error.message);
      Alert.alert('Error', 'No se pudo registrar el negocio');
    }
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Registrar Negocio</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="business" size={20} color="#666" style={styles.icon} />
          <TextInput style={styles.input} placeholder="Nombre del negocio" value={name} onChangeText={setName} />
        </View>

        <TouchableOpacity style={styles.inputContainer} onPress={() => setCategoryModalVisible(true)}>
          <Ionicons name="pricetag" size={20} color="#666" style={styles.icon} />
          <Text style={styles.input}>{category || 'Selecciona una categoría'}</Text>
        </TouchableOpacity>

        <RNModal visible={categoryModalVisible} animationType="slide" transparent>
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
                      setCategoryModalVisible(false);
                    }}
                  >
                    <Text style={styles.categoryText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity style={styles.closeButton} onPress={() => setCategoryModalVisible(false)}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </RNModal>

        <View style={styles.inputContainer}>
          <Ionicons name="locate" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Latitud"
            value={latitude}
            onChangeText={setLatitude}
            editable={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="locate" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Longitud"
            value={longitude}
            onChangeText={setLongitude}
            editable={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="document-text" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Descripción del negocio"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        <TouchableOpacity style={styles.locationButton} onPress={handleUseCurrentLocation}>
          <Text style={styles.locationButtonText}>📍 Usar mi ubicación actual</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => setMapModalVisible(true)}
        >
          <Text style={styles.buttonText}>🗺️ Seleccionar ubicación en mapa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.buttonText}>🖼️ Elegir Imagen</Text>
        </TouchableOpacity>

        {image && (
          <Image source={{ uri: image }} style={{ width: '100%', height: 200, marginTop: 10, borderRadius: 10 }} />
        )}

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>📌 Registrar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal del Mapa */}
      <Modal isVisible={mapModalVisible} style={styles.mapModal}>
        <View style={styles.mapContainer}>
          {initialRegion && (
            <MapView
              style={styles.map}
              initialRegion={initialRegion}
              onPress={handleMapPress}
            >
              {selectedLocation && (
                <Marker coordinate={selectedLocation} />
              )}
            </MapView>
          )}
          <View style={styles.mapButtonsContainer}>
            <TouchableOpacity style={styles.mapConfirmButton} onPress={confirmLocation}>
              <Text style={styles.mapButtonText}>Confirmar Ubicación</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mapCancelButton} onPress={() => setMapModalVisible(false)}>
              <Text style={styles.mapButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {loading && (
        <View style={styles.overlay}>
          <View style={styles.overlayBox}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.overlayText}>Registrando negocio...</Text>
          </View>
        </View>
      )}

      {success && (
        <View style={styles.overlay}>
          <View style={styles.overlayBox}>
            <Ionicons name="checkmark-circle-outline" size={64} color="#4CAF50" />
            <Text style={styles.overlayText}>Negocio registrado con éxito</Text>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60, backgroundColor: '#f4f6f8' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#333' },
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
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  imageButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  mapButton: {
    backgroundColor: '#9C27B0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  locationButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  locationButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  categoryItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd'
  },
  categoryText: {
    fontSize: 16,
    color: '#333'
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  overlayBox: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  overlayText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  mapModal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  mapContainer: {
    height: '80%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  mapButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
  },
  mapConfirmButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  mapCancelButton: {
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  mapButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});