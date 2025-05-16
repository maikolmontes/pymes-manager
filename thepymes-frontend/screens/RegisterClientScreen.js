import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '@env';

const { width, height } = Dimensions.get('window');

export default function RegisterClientScreen() {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [document, setDocument] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [userType, setUserType] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const userTypes = ['Emprendedor', 'Cliente'];

  const handleRegister = async () => {
    if (!name || !email || !password || !document || !userType) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Ingresa un correo electrónico válido');
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API_URL}/users/register`, {
        name,
        email,
        password,
        document,
        phone,
        address,
        user_type: userType,
      });

      setLoading(false);
      setSuccessVisible(true);

      setTimeout(() => {
        setSuccessVisible(false);
        setName('');
        setEmail('');
        setPassword('');
        setDocument('');
        setPhone('');
        setAddress('');
        setUserType('');
        navigation.goBack();
      }, 2000);
    } catch (error) {
      setLoading(false);
      const message = error?.response?.data?.message || 'Error al registrar. Intenta nuevamente.';
      alert(message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Register</Text>
      </View>

      <ScrollView contentContainerStyle={styles.bottomSection} showsVerticalScrollIndicator={false}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />

        <TextInput style={styles.input} placeholder="Nombre completo" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Correo electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="Número de documento" value={document} onChangeText={setDocument} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Teléfono" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Dirección" value={address} onChangeText={setAddress} />

        <Text style={styles.label}>Tipo de usuario</Text>
        <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
          <Text style={{ color: userType ? '#000' : '#888' }}>{userType || 'Selecciona una opción...'}</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {userTypes.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => {
                    setUserType(type);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalText}>{type}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.modalClose} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
          <Text style={styles.buttonText}>📝 Registrarse</Text>
        </TouchableOpacity>

        {/* Loading modal */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Registrando...</Text>
          </View>
        )}

        {/* Success modal */}
        <Modal visible={successVisible} animationType="fade" transparent>
          <View style={styles.successOverlay}>
            <View style={styles.successBox}>
              <Ionicons name="checkmark-circle-outline" size={64} color="green" />
              <Text style={styles.successText}>¡Registro exitoso!</Text>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topSection: {
    height: height * 0.22,
    backgroundColor: '#0A0E21',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
  },
  title: {
    color: '#fff',
    fontSize: width * 0.08,
    fontWeight: 'bold',
  },
  bottomSection: {
    padding: width * 0.06,
    paddingBottom: 80,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.2,
    height: width * 0.2,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    marginTop: 10,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#2E86DE',
    width: '100%',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    maxHeight: 300,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
  },
  modalClose: {
    marginTop: 20,
    backgroundColor: '#2E86DE',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontWeight: 'bold',
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successBox: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
  },
  successText: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
});
