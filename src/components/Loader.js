import React from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';

function LoaderView(props) {
	return (
		<View style={styles.container}>
			<ActivityIndicator style={styles.loader} size="large" color="#086F53" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		zIndex: 1000,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0,0,0,0.5)',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
});

export default LoaderView;
