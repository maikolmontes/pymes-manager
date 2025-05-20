import React, { useContext } from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';

// Pantallas
import HomeScreen from '../screens/HomeScreen';
import RegisterBusinessScreen from '../screens/RegisterBusinessScreen';
import MapScreen from '../screens/MapScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterClientScreen from '../screens/RegisterClientScreen';
import BusinessListScreen from '../screens/BusinessListScreen';
import BusinessListMyScreen from '../screens/BusinessListMyScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';

const { width } = Dimensions.get('window');
const Drawer = createDrawerNavigator();

function CustomDrawerContent({ navigation }) {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sí',
        onPress: () => {
          setUser(null);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Inicio' }],
          });
        },
      },
    ]);
  };

  return (
    <DrawerContentScrollView contentContainerStyle={styles.drawerContainer}>
      <SafeAreaView>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/logoW.png')} style={styles.logo} />
          <Text style={styles.logoText}>The PYMES Manager</Text>
          {user && (
            <Text style={styles.userInfo}>👤 {user.name} ({user.user_type})</Text>
          )}
        </View>

        {/* Común */}
        <DrawerItem
          label="Inicio"
          labelStyle={styles.drawerLabel}
          onPress={() => navigation.navigate('Inicio')}
          icon={() => (
            <Image source={require('../assets/logoW.png')} style={styles.icon} />
          )}
        />
        <DrawerItem
          label="Mapa"
          labelStyle={styles.drawerLabel}
          onPress={() => navigation.navigate('Mapa')}
          icon={() => (
            <Image source={require('../assets/logo2.png')} style={styles.icon} />
          )}
        />
        <DrawerItem
          label="Lista Negocios"
          labelStyle={styles.drawerLabel}
          onPress={() => navigation.navigate('Lista Negocios')}
          icon={() => (
            <Image source={require('../assets/logo3.png')} style={styles.icon} />
          )}
        />
        <DrawerItem
          label="Nosotros"
          labelStyle={styles.drawerLabel}
          onPress={() => navigation.navigate('Nosotros')}
          icon={() => (
            <Image source={require('../assets/logo4.png')} style={styles.icon} />
          )}
        />
        <DrawerItem
          label="Contacto"
          labelStyle={styles.drawerLabel}
          onPress={() => navigation.navigate('Contacto')}
          icon={() => (
            <Image source={require('../assets/logo5.png')} style={styles.icon} />
          )}
        />

        {/* No autenticado */}
        {!user && (
          <>
            <DrawerItem
              label="Iniciar Sesión"
              labelStyle={styles.drawerLabel}
              onPress={() => navigation.navigate('IniciarSesion')}
              icon={() => (
                <Image source={require('../assets/logo1.png')} style={styles.icon} />
              )}
            />
            <DrawerItem
              label="Registrarse"
              labelStyle={styles.drawerLabel}
              onPress={() => navigation.navigate('Registrarse')}
              icon={() => (
                <Image source={require('../assets/logo1.png')} style={styles.icon} />
              )}
            />
          </>
        )}

        {/* Si es emprendedor */}
        {user?.user_type === 'Emprendedor' && (
          <>
            <DrawerItem
              label="Mis Negocios"
              labelStyle={styles.drawerLabel}
              onPress={() => navigation.navigate('Mis Negocios')}
              icon={() => (
                <Image source={require('../assets/logo3.png')} style={styles.icon} />
              )}
            />
            <DrawerItem
              label="Registrar Negocios"
              labelStyle={styles.drawerLabel}
              onPress={() => navigation.navigate('Registro Negocios', { user })}
              icon={() => (
                <Image source={require('../assets/logo3.png')} style={styles.icon} />
              )}
            />
          </>
        )}

        {/* Cierre de sesión */}
        {user && (
          <DrawerItem
            label="Cerrar sesión"
            labelStyle={[styles.drawerLabel, { color: 'red' }]}
            onPress={handleLogout}
            icon={() => <Ionicons name="exit-outline" size={20} color="red" />}
          />
        )}
      </SafeAreaView>
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: { backgroundColor: '#0A0A23' },
        headerStyle: { backgroundColor: '#fff' },
        headerTitleAlign: 'center',
        headerTintColor: '#000',
        drawerLabelStyle: { color: '#fff', fontSize: width * 0.04 },
      }}
    >
      <Drawer.Screen name="Inicio" component={HomeScreen} />
      <Drawer.Screen name="IniciarSesion" component={LoginScreen} options={{ title: 'Iniciar Sesión' }} />
      <Drawer.Screen name="Registrarse" component={RegisterClientScreen} />
      <Drawer.Screen name="Mapa" component={MapScreen} />
      <Drawer.Screen name="Lista Negocios" component={BusinessListScreen} />
      <Drawer.Screen name="Mis Negocios" component={BusinessListMyScreen} />
      <Drawer.Screen name="Registro Negocios" component={RegisterBusinessScreen} />
      <Drawer.Screen name="Nosotros" component={AboutScreen} />
      <Drawer.Screen name="Contacto" component={ContactScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#0A0A23',
  },
  logoContainer: {
    alignItems: 'center',
    padding: 20,
    borderBottomColor: '#fff',
    borderBottomWidth: 0.5,
  },
  logo: {
    width: width * 0.18,
    height: width * 0.18,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  logoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
    textAlign: 'center',
  },
  userInfo: {
    color: '#ccc',
    fontSize: width * 0.035,
    marginTop: 8,
    textAlign: 'center',
  },
  icon: {
    width: width * 0.06,
    height: width * 0.06,
    marginRight: 10,
    resizeMode: 'contain',
  },
  drawerLabel: {
    color: '#fff',
    fontSize: width * 0.04,
  },
});
