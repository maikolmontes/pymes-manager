import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  useWindowDimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '@env';
import { UserContext } from '../context/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };

    if (!formData.email) {
      newErrors.email = 'El correo es requerido';
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Correo electrónico no válido';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
      valid = false;
    } else if (formData.password.length < 1) {
      newErrors.password = 'Mínimo 1 caracteres';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await axios.post(`${API_URL}/users/login`, formData);
      const user = res.data;

      setUser(user);
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'Inicio' }],
      });

    } catch (error) {
      const message = error?.response?.data?.message || 'Error al iniciar sesión';
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Implementar lógica de Google Sign-In
    Alert.alert('Próximamente', 'Inicio de sesión con Google estará disponible pronto');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={[styles.topSection, { paddingVertical: width * 0.2 }]}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              style={styles.backButton}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={width * 0.06} color="#fff" />
            </TouchableOpacity>
            <Text style={[styles.loginTitle, { fontSize: width * 0.08 }]}>
              Iniciar Sesión
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.bottomSection}>
            <Image 
              source={require('../assets/logo.png')} 
              style={[styles.logo, { 
                width: width * 0.25, 
                height: width * 0.25 
              }]} 
            />

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input, 
                  { fontSize: width * 0.04 },
                  errors.email && styles.inputError
                ]}
                placeholder="Correo electrónico"
                placeholderTextColor="#999"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                returnKeyType="next"
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input, 
                    { fontSize: width * 0.04 },
                    errors.password && styles.inputError
                  ]}
                  placeholder="Contraseña"
                  placeholderTextColor="#999"
                  value={formData.password}
                  onChangeText={(text) => handleChange('password', text)}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={styles.showPasswordButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? 'eye-off' : 'eye'} 
                    size={20} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              activeOpacity={0.7}
            >
              <Text style={[styles.forgot, { fontSize: width * 0.035 }]}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[styles.buttonText, { fontSize: width * 0.045 }]}>
                  Iniciar Sesión
                </Text>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Registrarse')}
              activeOpacity={0.7}
            >
              <Text style={[styles.signupText, { fontSize: width * 0.04 }]}>
                ¿No tienes cuenta?{' '}
                <Text style={styles.signupLink}>Regístrate</Text>
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={[styles.orText, { fontSize: width * 0.04 }]}>O</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Button */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
                style={styles.googleIcon}
              />
              <Text style={[styles.googleText, { fontSize: width * 0.04 }]}>
                Continuar con Google
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
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
    backgroundColor: '#0A0E21',
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 8,
  },
  loginTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomSection: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 40,
  },
  logo: {
    resizeMode: 'contain',
    marginBottom: 24,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 12,
  },
  input: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputError: {
    borderColor: '#ff4444',
    backgroundColor: '#fff6f6',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  showPasswordButton: {
    position: 'absolute',
    right: 12,
    padding: 8,
  },
  forgot: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    color: '#007bff',
  },
  loginButton: {
    backgroundColor: '#0A0E21',
    width: '100%',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'center',
    height: 50,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  signupText: {
    color: '#666',
    marginBottom: 16,
  },
  signupLink: {
    color: '#0A0E21',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  orText: {
    color: '#666',
    marginHorizontal: 10,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    width: '100%',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  googleText: {
    fontWeight: 'bold',
    color: '#444',
  },
});