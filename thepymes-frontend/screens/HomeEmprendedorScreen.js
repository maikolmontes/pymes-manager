import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../context/UserContext';

export default function HomeEmprendedorScreen() {
const { user } = useContext(UserContext);
const navigation = useNavigation();

return (
<View style={styles.container}>
<Image source={require('../assets/logo.png')} style={styles.logo} />
<Text style={styles.welcome}>¡Hola {user?.name}!</Text>
<Text style={styles.role}>Eres un Emprendedor registrado 🛠️</Text>
  <TouchableOpacity
    style={styles.myBusinessesButton}
    onPress={() => navigation.navigate('BusinessListMy')}
  >
    <Text style={styles.myBusinessesText}>📋 Ver mis negocios</Text>
  </TouchableOpacity>
</View>
);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#f4f6f8',
alignItems: 'center',
justifyContent: 'center',
padding: 20,
},
logo: {
width: 100,
height: 100,
resizeMode: 'contain',
marginBottom: 20,
},
welcome: {
fontSize: 24,
fontWeight: 'bold',
color: '#333',
marginBottom: 10,
},
role: {
fontSize: 18,
color: '#E67E22',
},
myBusinessesButton: {
marginTop: 30,
backgroundColor: '#2E86DE',
padding: 14,
borderRadius: 10,
},
myBusinessesText: {
color: '#fff',
fontWeight: 'bold',
textAlign: 'center',
},
});
