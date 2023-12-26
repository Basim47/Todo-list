import { View, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
// Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//Screens
import Todo from './src/screens/todo';
//Firebase
//Redux
import { Provider } from 'react-redux';
import store from './src/store';

const Stack = createNativeStackNavigator();
const Main = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Todo" component={Todo} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default Main;
