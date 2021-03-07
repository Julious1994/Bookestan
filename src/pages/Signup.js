import React from 'react';
import {
	View,
	Alert,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	ScrollView,
} from 'react-native';
import Typography from './../components/Typography';
import Input from './../components/Input';
import Button from './../components/Button';

import commonStyles from './../commonStyles';
import imageMapper from './../images/imageMapper';
import {StackActions} from '@react-navigation/native';
import Service from '../services/http';
import Page from '../components/Page';
import {useStateValue} from '../store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const services = new Service();

function Signup(props) {
	const {navigation} = props;
	const [state, dispatch] = useStateValue();
	const [credential, setCredential] = React.useState({});
	// const [load]
	const handleChange = React.useCallback((key, value) => {
		setCredential((c) => {
			return {...c, [key]: value};
		});
	}, []);

	const handleForgotPassword = React.useCallback(() => {
		navigation.dispatch(StackActions.push('ForgotPassword'));
	}, [navigation]);

	const handleSignin = React.useCallback(() => {
		navigation.goBack();
	}, [navigation]);

	const handleSignup = React.useCallback(() => {
		if (
			credential.Name &&
			credential.Password &&
			credential.confirmPassword &&
			credential.Email &&
			credential.MobileNumber
		) {
			if (credential.Password === credential.confirmPassword) {
				const data = {...credential};
				delete data.confirmPassword;
				dispatch({type: 'SET_LOADING', loading: true});
				const url = `?action=CustomerRegistration&Name=${credential.Name}&Email=${credential.Email}&Password=${credential.Password}&MobileNumber=${credential.MobileNumber}`;
				services.post(url).then((res) => {
					dispatch({type: 'SET_LOADING', loading: false});
					if (res.status === 200) {
						if (res.res.success === '1') {
							Alert.alert('Success', res.res.data, [
								{
									text: 'OK',
									onPress: () => {
										navigation.dispatch(StackActions.replace('Login'));
									},
								},
							]);
						} else {
							Alert.alert('Failed', res.res.data);
						}
					} else {
						Alert('Error', 'Please try again later');
					}
				});
			} else {
				Alert.alert('Validation Error', 'Confirm password is different');
			}
		} else {
			Alert.alert('Validation Error', 'All fields are required');
		}
	}, [credential, navigation, dispatch]);

	return (
		<Page>
			<ScrollView>
				<View
					style={[
						commonStyles.pageStyle,
						styles.container,
						commonStyles.largePageSize,
					]}>
					<Image
						source={imageMapper.logoIcon.source}
						style={styles.imageLogo}
					/>
					<Typography variant="title2" style={styles.welcomeText}>
						Sign up
					</Typography>
					<Input
						style={styles.input}
						value={credential.Name}
						placeholder="Enter your Full Name"
						label="Full Name"
						onChange={(value) => handleChange('Name', value)}
						left={true}
						icon={
							<Icon
								name="person"
								size={22}
								color="#113228"
								style={styles.lockIcon}
							/>
						}
					/>
					<Input
						style={styles.input}
						value={credential.Email}
						placeholder="Enter your Email"
						label="Email"
						onChange={(value) => handleChange('Email', value)}
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
						value={credential.MobileNumber}
						placeholder="Enter your mobile number"
						label="Mobile Number"
						onChange={(value) => handleChange('MobileNumber', value)}
						left={true}
						icon={
							<Icon
								name="phone"
								size={22}
								color="#113228"
								style={styles.lockIcon}
							/>
						}
					/>
					<Input
						style={styles.input}
						value={credential.Password}
						placeholder="Password"
						secureTextEntry={true}
						label="Password"
						onChange={(value) => handleChange('Password', value)}
						left={true}
						icon={
							<Image
								source={imageMapper.lock.source}
								style={styles.inputIcon}
								resizeMode="contain"
							/>
						}
					/>
					<Input
						style={styles.input}
						value={credential.confirmPassword}
						placeholder="Confirm Password"
						secureTextEntry={true}
						label="Confirm Password"
						onChange={(value) => handleChange('confirmPassword', value)}
						left={true}
						icon={
							<Image
								source={imageMapper.lock.source}
								style={styles.inputIcon}
								resizeMode="contain"
							/>
						}
					/>
					<Button
						style={styles.registerButton}
						title="REGISTER"
						onPress={handleSignup}
					/>
					<View style={styles.signupLinkContainer}>
						<Typography variant="description" style={styles.dontHaveAccount}>
							Already have an account?
						</Typography>
						<TouchableOpacity
							onPress={handleSignin}
							style={styles.signupContainer}>
							<Typography variant="description" style={styles.signup}>
								Sign in
							</Typography>
							<Image
								source={imageMapper.rightAngle.source}
								style={styles.signupIcon}
							/>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</Page>
	);
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	imageLogo: {
		width: 148,
		height: 74,
		alignSelf: 'center',
		marginTop: 30,
	},
	input: {
		marginTop: 10,
		marginBottom: 10,
	},
	forgotLink: {
		marginBottom: 20,
		alignSelf: 'flex-end',
	},
	forgotText: {
		textTransform: 'uppercase',
		color: '#086F53',
		fontWeight: 'bold',
		letterSpacing: 0.24,
	},
	signupLinkContainer: {
		display: 'flex',
		flexDirection: 'row',
		// position: 'absolute',
		marginTop: 25,
		alignSelf: 'center',
	},
	welcomeText: {
		alignSelf: 'flex-start',
		marginTop: 20,
		marginBottom: 10,
	},
	dontHaveAccount: {
		opacity: 0.5,
		marginRight: 5,
		color: '#696B6E',
	},
	signup: {
		color: '#FF8000',
		fontWeight: 'bold',
	},
	inputIcon: {
		width: 16,
		height: 16,
		marginTop: 16,
		marginLeft: 5,
		marginRight: 5,
	},
	signupIcon: {
		width: 7,
		height: 9,
		marginLeft: 3,
		marginTop: 5,
	},
	signupContainer: {
		display: 'flex',
		flexDirection: 'row',
		marginBottom: 10,
	},
	signinoptionsText: {
		alignSelf: 'center',
		marginTop: 30,
		fontWeight: 'normal',
		color: '#086f53',
	},
	socialContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignSelf: 'center',
	},
	socialImage: {
		width: 39,
		height: 39,
	},
	socialItem: {
		margin: 20,
	},
	registerButton: {
		marginTop: 15,
	},
	lockIcon: {
		marginTop: 12,
		marginLeft: 1,
		marginRight: 5,
	},
});

export default Signup;
