import React from 'react';
import {
	View,
	Text,
	Image,
	StyleSheet,
	TouchableOpacity,
	TextInput,
	Alert,
} from 'react-native';
import commonStyles from '../../commonStyles';
import Typography from '../../components/Typography';
import Button from '../../components/Button';

import BottomBar from '../BottomBar';
import {useStateValue} from '../../store/store';
import imageMapper from './../../images/imageMapper';
import Service from '../../services/http';
import {getInitial} from '../../utils';
import LinearGradient from 'react-native-linear-gradient';
import {StackActions} from '@react-navigation/native';

const services = new Service();

function EditProfile(props) {
	const {navigation} = props;
	const [state, dispatch] = useStateValue();
	const [user, setUser] = React.useState(state?.user || {});

	const handleChange = React.useCallback((name, val) => {
		setUser((usr) => {
			return {...usr, [name]: val};
		});
	}, []);

	const handleSave = React.useCallback(() => {
		const url = `?action=CustProfileUpdate&Name=${user.Name}&CustomerID=${user.CustomerID}&Password=${user.Password}&MobileNumber=${user.MobileNumber}`;
		services.get(url).then((res) => {
			if (res.success === '1') {
				Alert.alert('Success', res.data);
				dispatch({type: 'SET_USER', userData: {...user}});
			} else {
				Alert.alert('Success', res ? res.data : 'Please try again...');
			}
		});
	}, [user, dispatch]);
	return (
		<View style={commonStyles.pageStyle}>
			<LinearGradient
				colors={['rgba(8, 111, 83, 1)', 'rgba(10, 138, 103, 1)']}
				style={[styles.linearGradient, styles.headerContainer]}>
				<View style={styles.headerView}>
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						style={styles.settingButton}>
						<Image source={imageMapper.back.source} style={styles.backIcon} />
					</TouchableOpacity>
					<Typography variant="title2" style={styles.profileTitle}>
						Edit Profile
					</Typography>
					<View />
				</View>
				<View style={styles.avatar}>
					<Text style={styles.initialText}>{getInitial(state?.user.Name)}</Text>
				</View>
				<Typography variant="title2" style={styles.userName}>
					{state?.user.Name}
				</Typography>
			</LinearGradient>
			<View style={styles.content}>
				<View style={styles.inputView}>
					<Typography variant="body" style={styles.fieldTitle}>
						Full Name
					</Typography>
					<TextInput
						style={styles.input}
						value={user.Name}
						onChangeText={(txt) => handleChange('Name', txt)}
					/>
				</View>
				<View style={styles.inputView}>
					<Typography variant="body" style={styles.fieldTitle}>
						Phone No.
					</Typography>
					<TextInput
						style={styles.input}
						value={user.MobileNumber}
						onChangeText={(txt) => handleChange('MobileNumber', txt)}
					/>
				</View>
				<View style={styles.inputView}>
					<Typography variant="body" style={styles.fieldTitle}>
						Your Email
					</Typography>
					<TextInput
						style={styles.input}
						value={user.Email}
						editable={false}
						selectTextOnFocus={false}
						onChangeText={(txt) => handleChange('Email', txt)}
					/>
				</View>
				<Button title="DONE" style={styles.doneButton} onPress={handleSave} />
			</View>

			<BottomBar navigation={navigation} />
		</View>
	);
}

const styles = StyleSheet.create({
	tabContainer: {},
	backIcon: {
		width: 16,
		height: 16,
		tintColor: '#fff',
		marginTop: 5,
	},
	settingButton: {},
	headerContainer: {
		paddingLeft: 36,
		paddingRight: 36,
		paddingTop: 25,
		height: 200,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
	headerView: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	profileTitle: {
		color: '#fff',
	},
	avatar: {
		marginTop: 25,
		width: 64,
		height: 64,
		borderColor: '#fff',
		borderWidth: 2,
		alignSelf: 'center',
		borderRadius: 64,
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		backgroundColor: 'rgba(8, 111, 83, 1)',
	},
	initialText: {
		color: '#fff',
		fontSize: 32,
	},
	userName: {
		marginTop: 15,
		fontWeight: '600',
		alignSelf: 'center',
		color: '#fff',
	},
	content: {
		paddingLeft: 36,
		paddingRight: 36,
		paddingTop: 36,
		height: '58%',
	},
	fieldTitle: {
		marginTop: 12,
	},
	input: {
		marginLeft: 10,
		// backgroundColor: 'gray',
		flex: 1,
		textAlign: 'right',
	},
	inputView: {
		display: 'flex',
		flexDirection: 'row',
		borderBottomColor: 'rgba(112, 112, 112, 0.1)',
		borderBottomWidth: 0.5,
	},
	doneButton: {
		marginTop: 100,
	},
});

export default EditProfile;
