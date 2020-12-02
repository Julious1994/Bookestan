import React from 'react';
import HomeScreen from './pages/Home/Home';
import LoginScreen from './pages/Login';

const routes = (Stack) => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Login" component={LoginScreen} key="login" />
    <Stack.Screen name="Home" component={HomeScreen} />
  </Stack.Navigator>
);

export default routes;
