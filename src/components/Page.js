import React from 'react';
import {View, StyleSheet} from 'react-native';
import Loader from './Loader';
import {useStateValue} from '../store/store';

function Page(props) {
	const [state] = useStateValue();

	return (
		<View style={styles.container}>
			{state.loading && <Loader />}
			{props.children}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'relative',
	},
});

export default Page;
