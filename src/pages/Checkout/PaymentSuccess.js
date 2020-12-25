import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Typography from '../../components/Typography';
import Button from '../../components/Button';

function PaymentSuccess(props) {
	return (
		<View style={styles.container}>
			<View style={styles.successBox} elavation={5}>
				<View style={styles.checkWrapper}>
					<Icon name="check" color="#fff" size={42} />
				</View>
				<Typography variant="title2" style={styles.titleText}>
					Payment Done
				</Typography>
				<Typography variant="body" style={styles.messageText}>
					Your transaction was successful
				</Typography>
				<Button
					title="Done"
					onPress={props.handleDone}
					style={styles.doneButton}
				/>
			</View>
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
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(245, 250, 249, 0.95)',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	successBox: {
		alignSelf: 'center',
		elevation: 5,
		padding: 30,
		backgroundColor: '#fff',
		borderRadius: 5,
	},
	titleText: {
		alignSelf: 'center',
		marginTop: 24,
		marginBottom: 12,
	},
	messageText: {
		alignSelf: 'center',
		marginBottom: 40,
	},
	doneButton: {},
	checkWrapper: {
		height: 52,
		width: 52,
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		borderRadius: 52,
		alignSelf: 'center',
		backgroundColor: 'rgba(255, 128, 0, 1)',
	}
});

export default PaymentSuccess;
