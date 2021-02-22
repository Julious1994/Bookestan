import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Typography from './../components/Typography';
import imageMapper from './../images/imageMapper';
import {StackActions} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {logout} from './Profile/Logout';

function Drawer(props) {
	const {dispatch, navigation} = props;

	const handleClose = React.useCallback(() => {
		dispatch({type: 'TOGGELE_DRAWER'});
	}, [dispatch]);

	const handleLogout = React.useCallback(() => {
		logout(navigation);
	}, [navigation]);

	const handleBooks = React.useCallback(() => {
		handleClose();
		navigation.dispatch(StackActions.push('BookProfile'));
	}, [navigation]);

	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={styles.layer}
				activeOpacity={0.5}
				onPress={handleClose}
			/>
			<View style={styles.contentView}>
				<Image source={imageMapper.logoIcon.source} style={styles.logo} />
				<TouchableOpacity style={styles.menuItem} onPress={handleBooks}>
					<Icon name="library-books" size={24} color="#086F53" />
					<Typography variant="body" style={styles.menuText}>
						My Books
					</Typography>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.menuItem, styles.noBorder]}
					onPress={handleLogout}>
					<Icon name="exit-to-app" size={24} color="#086F53" />
					<Typography variant="body" style={styles.menuText}>
						Logout
					</Typography>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		zIndex: 1001,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	layer: {
		backgroundColor: 'rgba(0,0,0,0.5)',
		position: 'absolute',
		opacity: 0.5,
		width: '100%',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	contentView: {
		width: '70%',
		height: '100%',
		backgroundColor: '#fff',
	},
	logo: {
		width: 100,
		height: 50,
		alignSelf: 'center',
		marginTop: 15,
		marginBottom: 15,
	},
	menuItem: {
		display: 'flex',
		flexDirection: 'row',
		padding: 10,
		borderBottomColor: 'rgba(8, 111, 83, 0.2)',
		borderBottomWidth: 0.5,
	},
	menuText: {
		color: '#086F53',
		flex: 1,
		paddingLeft: 20,
		marginTop: 2,
	},
	noBorder: {
		borderBottomWidth: 0,
	},
});

export default Drawer;
