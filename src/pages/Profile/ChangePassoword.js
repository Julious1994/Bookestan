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
import Input from '../../components/Input';
import {logout} from './Logout';

const services = new Service();

function ChangePassword(props) {
	const {navigation} = props;
	const [state, dispatch] = useStateValue();
	const [user, setUser] = React.useState(state?.user || {});
	const [pwd, setPwd] = React.useState({});

	const handleChange = React.useCallback((name, val) => {
		setPwd((usr) => {
			return {...usr, [name]: val};
		});
	}, []);

	const handleSave = React.useCallback(() => {
		if (pwd.oldPassword === user.Password) {
			if (pwd.newPassword === pwd.confirmPassword) {
				const url = `?action=CustProfileUpdate&Name=${user.Name}&CustomerID=${user.CustomerID}&Password=${pwd.newPassword}&MobileNumber=${user.MobileNumber}`;
				services.get(url).then((res) => {
					if (res.success === '1') {
						Alert.alert('Success', res.data);
						dispatch({type: 'SET_USER', userData: {...user}});
						logout(navigation);
					} else {
						Alert.alert('Success', res ? res.data : 'Please try again...');
					}
				});
			} else {
				Alert.alert('Validation', 'Confirm password is different');
			}
		} else {
			Alert.alert('Validation', 'Please enter correct old password');
		}
	}, [user, dispatch, pwd, navigation]);

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
						Change Password
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
				<Input
					style={styles.input}
					value={pwd.oldPassword || ''}
					placeholder="Old Password"
					label="Old Password"
					secureTextEntry={true}
					onChange={(value) => handleChange('oldPassword', value)}
					left={true}
					icon={
						<Image
							source={imageMapper.messages.source}
							style={styles.inputIcon}
							resizeMode="contain"
						/>
					}
				/>
				<Input
					style={styles.input}
					value={pwd.newPassword || ''}
					placeholder="New Password"
					label="New Password"
					secureTextEntry={true}
					onChange={(value) => handleChange('newPassword', value)}
					left={true}
					icon={
						<Image
							source={imageMapper.messages.source}
							style={styles.inputIcon}
							resizeMode="contain"
						/>
					}
				/>
				<Input
					style={styles.input}
					value={pwd.confirmPassword || ''}
					placeholder="Confirm Password"
					label="Confirm Password"
					secureTextEntry={true}
					onChange={(value) => handleChange('confirmPassword', value)}
					left={true}
					icon={
						<Image
							source={imageMapper.messages.source}
							style={styles.inputIcon}
							resizeMode="contain"
						/>
					}
				/>

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
		paddingTop: 8,
		height: '58%',
	},
	fieldTitle: {
		marginTop: 12,
	},
	input: {
		marginTop: 10,
		marginBottom: 10,
	},
	inputIcon: {
		width: 16,
		height: 16,
		marginTop: 16,
		marginLeft: 5,
		marginRight: 5,
	},
	inputView: {
		display: 'flex',
		flexDirection: 'row',
		borderBottomColor: 'rgba(112, 112, 112, 0.1)',
		borderBottomWidth: 0.5,
	},
	doneButton: {
		marginTop: 10,
	},
});

export default ChangePassword;
