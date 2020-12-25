import React from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';

function Input(props) {
	const {icon, left, label} = props;

	const inputView = (
		<View style={[styles.container, !label && props.style]}>
			{left && icon}
			<TextInput
				secureTextEntry={props.secureTextEntry}
				placeholderTextColor="#66837b"
				placeholder={props.placeholder}
				onChangeText={props.onChange}
				value={props.value}
				style={[styles.input]}
			/>
			{!left && icon}
		</View>
	);

	return label ? (
		<View style={props.style}>
			{label && <Text style={styles.label}>{label}</Text>}
			{inputView}
		</View>
	) : (
		inputView
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF00',
		borderColor: 'rgba(105,107,110, 0.2)',
		borderWidth: 0.5,
		borderRadius: 5,
		padding: 8,
		paddingBottom: 0,
		paddingTop: 0,
		display: 'flex',
		flexDirection: 'row',
		// opacity: 0.3,
	},
	input: {
		color: '#66837b',
		opacity: 1,
	},
	label: {
		color: '#003124',
		opacity: 0.5,
		fontSize: 12,
		marginBottom: 5,
	},
});

export default Input;
