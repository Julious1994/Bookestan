import React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import routes from './routes';
import {StateProvider} from './store/store';
import {reducer, initialState} from './store/reducer';

const Stack = createStackNavigator();

function App() {
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <NavigationContainer>{routes(Stack)}</NavigationContainer>
    </StateProvider>
  );
}

export default App;
