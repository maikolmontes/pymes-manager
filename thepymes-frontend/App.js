import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './navigation/DrawerNavigator';
import { UserProvider } from './context/UserContext';

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </UserProvider>
  );
}
