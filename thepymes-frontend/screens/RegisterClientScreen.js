import React, { useState, useRef } from 'react';
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
  KeyboardAvoidingView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '@env';

const { width, height } = Dimensions.get('window');

const RegisterClientScreen = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    document: '',
    phone: '',
    address: '',
    userType: '',
  });

  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const userTypes = ['Emprendedor', 'Cliente'];

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) newErrors.name = 'Nombre completo requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'Correo electrónico requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Correo electrónico no válido';
    }
    if (!formData.password) newErrors.password = 'Contraseña requerida';
    if (!formData.document.trim()) newErrors.document = 'Documento requerido';
    if (!formData.userType) newErrors.userType = 'Tipo de usuario requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      await axios.post(`${API_URL}/users/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        document: formData.document,
        phone: formData.phone,
        address: formData.address,
        user_type: formData.userType,
      });

      setSuccessVisible(true);
      setTimeout(() => {
        setSuccessVisible(false);
        setFormData({
          name: '',
          email: '',
          password: '',
          document: '',
          phone: '',
          address: '',
          userType: '',
        });
        navigation.goBack();
      }, 2000);
    } catch (error) {
      const message = error?.response?.data?.message || 'Error al registrar. Intenta nuevamente.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.topSection}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              style={styles.backButton}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Registro</Text>
          </View>

          {/* Form Section */}
          <View style={styles.bottomSection}>
            <Image 
              source={require('../assets/logo.png')} 
              style={styles.logo} 
              resizeMode="contain"
            />

            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre completo*"
                value={formData.name}
                onChangeText={(text) => handleChange('name', text)}
                returnKeyType="next"
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico*"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña*"
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                secureTextEntry
                returnKeyType="next"
              />
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            {/* Document Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="card" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Número de documento*"
                value={formData.document}
                onChangeText={(text) => handleChange('document', text)}
                keyboardType="numeric"
                returnKeyType="next"
              />
            </View>
            {errors.document && <Text style={styles.errorText}>{errors.document}</Text>}

            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="call" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Teléfono"
                value={formData.phone}
                onChangeText={(text) => handleChange('phone', text)}
                keyboardType="phone-pad"
                returnKeyType="next"
              />
            </View>

            {/* Address Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="home" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Dirección"
                value={formData.address}
                onChangeText={(text) => handleChange('address', text)}
                returnKeyType="done"
              />
            </View>

            {/* User Type Selector */}
            <Text style={styles.label}>Tipo de usuario*</Text>
            <TouchableOpacity 
              style={styles.inputContainer} 
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="person-circle" size={20} color="#666" style={styles.icon} />
              <Text style={[styles.input, !formData.userType && styles.placeholderText]}>
                {formData.userType || 'Selecciona una opción...'}
              </Text>
            </TouchableOpacity>
            {errors.userType && <Text style={styles.errorText}>{errors.userType}</Text>}

            {/* Register Button */}
            <TouchableOpacity 
              style={styles.registerButton} 
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Registrarse</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* User Type Modal */}
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Selecciona tu tipo de usuario</Text>
                {userTypes.map((type, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.modalItem}
                    onPress={() => {
                      handleChange('userType', type);
                      setModalVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalText}>{type}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity 
                  style={styles.modalClose} 
                  onPress={() => setModalVisible(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalCloseText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Success Modal */}
          <Modal visible={successVisible} animationType="fade" transparent>
            <View style={styles.successOverlay}>
              <View style={styles.successBox}>
                <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
                <Text style={styles.successText}>¡Registro exitoso!</Text>
                <Text style={styles.successSubtext}>Serás redirigido automáticamente</Text>
              </View>
            </View>
          </Modal>
        </ScrollView>

        {/* Loading Overlay */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Registrando...</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
  },
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
    padding: 8,
  },
  title: {
    color: '#fff',
    fontSize: width * 0.08,
    fontWeight: 'bold',
  },
  bottomSection: {
    padding: width * 0.06,
    paddingBottom: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.2,
    height: width * 0.2,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  placeholderText: {
    color: '#888',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 10,
    alignSelf: 'flex-start',
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    marginTop: 10,
    fontWeight: '600',
    color: '#333',
    fontSize: 14,
  },
  registerButton: {
    backgroundColor: '#2E86DE',
    width: '100%',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
    height: 50,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
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
  modalCloseText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successBox: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
  },
  successText: {
    fontSize: 18,
    marginTop: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
  },
  successSubtext: {
    fontSize: 14,
    marginTop: 8,
    color: '#666',
    textAlign: 'center',
  },
});

export default RegisterClientScreen;