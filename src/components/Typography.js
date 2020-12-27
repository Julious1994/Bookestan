import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet} from 'react-native';

function Typography(props) {
	return (
		<View style={[styles.container, props.containerStyle]}>
			<Text
				numberOfLines={props.lines}
				style={[
					styles[props.variant],
					Array.isArray(props.style) ? [...props.style] : {...props.style},
				]}>
				{props.children}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {},
	title1: {
		fontFamily: 'Montserrat',
		fontStyle: 'normal',
		fontWeight: 'bold',
		fontSize: 26,
		lineHeight: 32,
		letterSpacing: -0.03,
		color: '#003124',
	},
	title2: {
		fontStyle: 'normal',
		fontWeight: 'bold',
		fontSize: 18,
		lineHeight: 25,
		letterSpacing: -0.03,
		color: '#003124',
	},
	title3: {
		fontStyle: 'normal',
		fontWeight: 'bold',
		fontSize: 16,
		lineHeight: 32,
		letterSpacing: -0.03,
		color: '#086f53',
	},
	body: {
		fontStyle: 'normal',
		fontWeight: 'bold',
		fontSize: 14,
		lineHeight: 19,
		letterSpacing: -0.03,
		color: '#666F7B',
	},
	description: {
		fontStyle: 'normal',
		fontWeight: '600',
		fontSize: 12,
		lineHeight: 16,
		letterSpacing: -0.03,
		color: '#086f53',
	},
	tiny1: {
		fontStyle: 'normal',
		fontWeight: 'normal',
		fontSize: 10,
		lineHeight: 14,
		color: '#666F7B',
	},
	tiny2: {
		fontStyle: 'normal',
		fontWeight: 'normal',
		fontSize: 8,
		lineHeight: 11,
		color: '#666F7B',
	},
});

Typography.propTypes = {
	children: PropTypes.string,
	variant: PropTypes.string,
};

export default Typography;
