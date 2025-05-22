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
import BusinessListMyScreen from '../screens/BusinessListMyScreen';
import EditBusinessScreen from '../screens/EditBusinessScreen';
const Stack = createNativeStackNavigator();

export default function StackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Inicio" component={HomeScreen} />
            <Stack.Screen name="IniciarSesion" component={LoginScreen} />
            <Stack.Screen name="Registrarse" component={RegisterClientScreen} />
            <Stack.Screen name="Drawer" component={DrawerNavigator} />
            <Stack.Screen name="BusinessListMy" component={BusinessListMyScreen} />
            <Stack.Screen name="EditBusiness" component={EditBusinessScreen} />

        </Stack.Navigator>
        
    );
}
