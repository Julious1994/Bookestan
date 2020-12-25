import React from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions} from '@react-navigation/native';

export function logout(navigation) {
	Alert.alert('Logout', 'Do you want to logut', [
		{
			text: 'YES',
			onPress: async () => {
				await AsyncStorage.removeItem('user');
				navigation.dispatch(StackActions.replace('Login'));
			},
		},
		{text: 'NO'},
	]);
}
