// navigation/StackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa todas tus pantallas
import HomeScreen from '../screens/HomeScreen';
import RegisterBusinessScreen from '../screens/RegisterBusinessScreen';
import MapScreen from '../screens/MapScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterClientScreen from '../screens/RegisterClientScreen';
import BusinessListScreen from '../screens/BusinessListScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Inicio"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Registro Negocios"
                component={RegisterBusinessScreen}
                options={{ title: 'Registrar Negocio' }}
            />
            <Stack.Screen
                name="Mapa"
                component={MapScreen}
                options={{ title: 'Mapa de Negocios' }}
            />
            <Stack.Screen
                name="IniciarSesion"
                component={LoginScreen}
                options={{ title: 'Iniciar Sesión' }}
            />
            <Stack.Screen
                name="Registrarse"
                component={RegisterClientScreen}
                options={{ title: 'Registro de Usuario' }}
            />
            <Stack.Screen
                name="ListaNegocios"
                component={BusinessListScreen}
                options={{ title: 'Lista de Negocios' }}
            />
            <Stack.Screen
                name="Nosotros"
                component={AboutScreen}
                options={{ title: 'Sobre Nosotros' }}
            />
            <Stack.Screen
                name="Contacto"
                component={ContactScreen}
                options={{ title: 'Contacto' }}
            />
        </Stack.Navigator>
    );
}
