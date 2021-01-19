import React from 'react';
import {
	View,
	Alert,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
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
// import twitter, { auth } from "react-native-twitter";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import OAuthManager from 'react-native-oauth';
const config = {
	twitter: {
		consumerKey: 'ecJnjMHdgPqcA5oHqGqYLX0MN',
		consumerSecret: '9LZ6cAuE1KkeWuRPgnMMZAG1nbOHARtfvpinUzHgrTXwWtgLI9',
	},
};
// const manager = new OAuthManager('bookestan');
// manager.configure(config);
const services = new Service();

function Login(props) {
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

	const handleSignup = React.useCallback(() => {
		navigation.dispatch(StackActions.push('Signup'));
	}, [navigation]);

	const handleLogin = React.useCallback(() => {
		if (credential.Email && credential.Password) {
			dispatch({type: 'SET_LOADING', loading: true});
			const url = `?action=LoginAPI&Email=${credential.Email}&Password=${credential.Password}`;
			services.post(url).then(async (res) => {
				dispatch({type: 'SET_LOADING', loading: false});
				if (res.status === 200) {
					if (res.res.success === '0') {
						Alert.alert('Login Failure', res.res.data);
					} else {
						dispatch({type: 'SET_USER', userData: res.res});
						await AsyncStorage.setItem('user', JSON.stringify({...res.res}));
						navigation.dispatch(
							StackActions.replace('Home', {
								params: {user: {...credential}},
							}),
						);
					}
				} else {
					let message = '';
					if (Array.isArray(res.res)) {
						message = res.res[0];
					} else {
						message = res.res || res.res.Message;
					}
					Alert.alert('Network Error', message);
				}
			});
		} else {
			Alert.alert('Validation Error', 'All fields are required');
		}
	}, [credential, navigation, dispatch]);

	React.useEffect(() => {
		async function getUser() {
			const user = await AsyncStorage.getItem('user');
			if (user) {
				const userData = user ? JSON.parse(user) : {};
				dispatch({type: 'SET_USER', userData});
				navigation.dispatch(
					StackActions.replace('Home', {
						params: {user: {...userData}},
					}),
				);
			}
		}
		getUser();
	}, [dispatch, navigation]);

	const handleTwitterLogin = React.useCallback(() => {

		// manager.authorize('twitter', {fields: 'screen_name'}).then((resp) => {
		// 	const {response} = resp;
		// 	if (resp.authorized) {
		// 		const userTimelineUrl = `https://api.twitter.com/1.1/users/show.json?user_id=${resp.response.uuid}`;
		// 		manager.makeRequest('twitter', userTimelineUrl).then((result) => {
		// 			socialLogin({
		// 				name: result.data.name,
		// 				token: response.credentials.access_token,
		// 			});
		// 		});
		// 	} else {
		// 	}
		// });
	}, [socialLogin]);

	const socialLogin = React.useCallback(
		(info) => {
			const url = `?action=SocialLogin&Name=${info.name}&TokenID=${info.token}`;

			services.get(url).then(async (res) => {
				if (res.success === '1') {
					dispatch({type: 'SET_USER', userData: res});
					await AsyncStorage.setItem('user', JSON.stringify({...res}));
					navigation.dispatch(
						StackActions.replace('Home', {
							params: {user: {...res}},
						}),
					);
				} else {
					Alert.alert('Failed', 'Failed to login');
				}
			});
		},
		[dispatch, navigation],
	);

	return (
		<Page>
			<View
				style={[
					commonStyles.pageStyle,
					styles.container,
					commonStyles.largePageSize,
				]}>
				<Image source={imageMapper.logoIcon.source} style={styles.imageLogo} />
				<Typography variant="title2" style={styles.welcomeText}>
					Sign in
				</Typography>
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
				<TouchableOpacity
					style={styles.forgotLink}
					onPress={handleForgotPassword}>
					<Typography variant="description" style={styles.forgotText}>
						Forgot password
					</Typography>
				</TouchableOpacity>
				<Button title="Login" onPress={handleLogin} />
				<View style={styles.signupLinkContainer}>
					<Typography variant="description" style={styles.dontHaveAccount}>
						Don't have an account?
					</Typography>
					<TouchableOpacity
						onPress={handleSignup}
						style={styles.signupContainer}>
						<Typography variant="description" style={styles.signup}>
							Sign up
						</Typography>
						<Image
							source={imageMapper.rightAngle.source}
							style={styles.signupIcon}
						/>
					</TouchableOpacity>
				</View>
				{/* <Typography variant="body" style={styles.signinoptionsText}>
					or sign in with
				</Typography>
				<View style={styles.socialContainer}>
					<TouchableOpacity
						style={styles.socialItem}
						onPress={handleTwitterLogin}>
						<Image
							source={imageMapper.twiter.source}
							style={styles.socialImage}
							resizeMode="contain"
						/>
					</TouchableOpacity>
					<TouchableOpacity style={styles.socialItem} onPress={() => {}}>
						<Image
							source={imageMapper.fb.source}
							style={styles.socialImage}
							resizeMode="contain"
						/>
					</TouchableOpacity>
					<TouchableOpacity style={styles.socialItem} onPress={() => {}}>
						<Image
							source={imageMapper.instagram.source}
							style={styles.socialImage}
							resizeMode="contain"
						/>
					</TouchableOpacity>
				</View> */}
			</View>
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
});

export default Login;
