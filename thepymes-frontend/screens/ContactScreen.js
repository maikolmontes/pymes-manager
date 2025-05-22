import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Linking } from 'react-native';

export default function ContactScreen() {
  const { width } = useWindowDimensions();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }

    setIsSubmitting(true);
    
    // Simulación de envío
    console.log('Formulario enviado:', formData);
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        '¡Gracias!',
        'Tu mensaje ha sido enviado. Nos pondremos en contacto contigo pronto.',
        [
          { 
            text: 'OK', 
            onPress: () => setFormData({ name: '', email: '', message: '' }) 
          }
        ]
      );
    }, 1500);
  };

  const openURL = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', `No se pudo abrir la URL: ${url}`);
      }
    } catch (error) {
      console.error("Error al abrir URL: ", error);
      Alert.alert('Error', 'Ocurrió un problema al intentar abrir el enlace');
    }
  };

  const socialLinks = [
    { name: 'facebook', url: 'https://www.facebook.com/', color: '#3b5998' },
    { name: 'twitter', url: 'https://twitter.com/', color: '#00acee' },
    { name: 'instagram', url: 'https://www.instagram.com/', color: '#e4405f' },
    { name: 'whatsapp', url: 'https://wa.me/', color: '#25d366' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView 
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Icon name="email" size={40} color="#2196F3" />
            <Text style={[styles.title, { fontSize: width * 0.06 }]}>
              ¡Contáctanos!
            </Text>
          </View>

          <View style={styles.separator} />

          <Text style={[styles.text, { fontSize: width * 0.043 }]}>
            ¿Tienes alguna pregunta o sugerencia? Llena el siguiente formulario y nos pondremos en contacto contigo.
          </Text>

          <TextInput
            style={[styles.input, { fontSize: width * 0.04 }]}
            placeholder="Tu nombre"
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
            returnKeyType="next"
            blurOnSubmit={false}
          />

          <TextInput
            style={[styles.input, { fontSize: width * 0.04 }]}
            placeholder="Tu correo electrónico"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            blurOnSubmit={false}
          />

          <TextInput
            style={[styles.input, styles.textArea, { fontSize: width * 0.04 }]}
            placeholder="Tu mensaje"
            value={formData.message}
            onChangeText={(text) => handleChange('message', text)}
            multiline
            numberOfLines={4}
            returnKeyType="done"
          />

          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </Text>
          </TouchableOpacity>

          <View style={styles.socialContainer}>
            <Text style={[styles.socialText, { fontSize: width * 0.045 }]}>
              Síguenos en nuestras redes sociales:
            </Text>
            <View style={styles.socialIcons}>
              {socialLinks.map((social, index) => (
                <TouchableOpacity 
                  key={index}
                  onPress={() => openURL(social.url)}
                  activeOpacity={0.7}
                >
                  <Icon 
                    name={social.name} 
                    size={30} 
                    color={social.color} 
                    style={styles.icon} 
                  />
                </TouchableOpacity>
              ))}
            </View>
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
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    color: '#2196F3',
    marginLeft: 10,
  },
  separator: {
    height: 2,
    backgroundColor: '#2196F3',
    width: '30%',
    alignSelf: 'center',
    marginVertical: 15,
  },
  text: {
    lineHeight: 24,
    textAlign: 'center',
    color: '#444',
    marginBottom: 20,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#90CAF9',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  socialContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  socialText: {
    marginBottom: 10,
    color: '#444',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '60%',
  },
  icon: {
    margin: 10,
  },
});