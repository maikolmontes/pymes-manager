// navigation/StackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import RegisterBusinessScreen from '../screens/RegisterBusinessScreen';
import MapScreen from '../screens/MapScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterClientScreen from '../screens/RegisterClientScreen';
import BusinessListScreen from '../screens/BusinessListScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';
import DrawerNavigator from './DrawerNavigator'; // ✅ IMPORTANTE

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Inicio" component={HomeScreen} />
            <Stack.Screen name="IniciarSesion" component={LoginScreen} />
            <Stack.Screen name="Registrarse" component={RegisterClientScreen} />
            <Stack.Screen name="Drawer" component={DrawerNavigator} />
        </Stack.Navigator>
    );
}
