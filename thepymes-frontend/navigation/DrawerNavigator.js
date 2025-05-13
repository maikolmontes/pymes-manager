import React from 'react';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import {
    Image,
    View,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importa tus pantallas
import HomeScreen from '../screens/HomeScreen';
import RegisterBusinessScreen from '../screens/RegisterBusinessScreen';
import MapScreen from '../screens/MapScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterClientScreen from '../screens/RegisterClientScreen';
import BusinessListScreen from '../screens/BusinessListScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';

const { width } = Dimensions.get('window');
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
            <SafeAreaView>
                <View style={styles.logoContainer}>
                    <Image source={require('../assets/logoW.png')} style={styles.logo} />
                    <Text style={styles.logoText}>The Pymes Manager</Text>
                </View>
                <DrawerItemList {...props} />
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

            <Drawer.Screen
                name="Iniciar Sesión"
                component={LoginScreen}
                options={{
                    drawerIcon: () => (
                        <Image source={require('../assets/logo1.png')} style={styles.icon} />
                    ),
                }}
            />

            <Drawer.Screen
                name="Registrarse"
                component={RegisterClientScreen}
                options={{
                    drawerIcon: () => (
                        <Image source={require('../assets/logo1.png')} style={styles.icon} />
                    ),
                }}
            />

            <Drawer.Screen
                name="Mapa"
                component={MapScreen}
                options={{
                    drawerIcon: () => (
                        <Image source={require('../assets/logo2.png')} style={styles.icon} />
                    ),
                }}
            />

            <Drawer.Screen
                name="Lista Negocios"
                component={BusinessListScreen}
                options={{
                    drawerIcon: () => (
                        <Image source={require('../assets/logo3.png')} style={styles.icon} />
                    ),
                }}
            />

            <Drawer.Screen
                name="Registro Negocios"
                component={RegisterBusinessScreen}
                options={{
                    drawerIcon: () => (
                        <Image source={require('../assets/logo3.png')} style={styles.icon} />
                    ),
                }}
            />

            <Drawer.Screen
                name="Nosotros"
                component={AboutScreen}
                options={{
                    drawerIcon: () => (
                        <Image source={require('../assets/logo4.png')} style={styles.icon} />
                    ),
                }}
            />

            <Drawer.Screen
                name="Contacto"
                component={ContactScreen}
                options={{
                    drawerIcon: () => (
                        <Image source={require('../assets/logo5.png')} style={styles.icon} />
                    ),
                }}
            />
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
    icon: {
        width: width * 0.06,
        height: width * 0.06,
        marginRight: 10,
        resizeMode: 'contain',
    },
});
