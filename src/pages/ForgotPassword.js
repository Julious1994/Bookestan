import React from 'react';
import {
	View,
	Text,
	Alert,
	StyleSheet,
	Image,
	TouchableOpacity,
} from 'react-native';
import Typography from './../components/Typography';
import Input from './../components/Input';
import Button from './../components/Button';
import commonStyles from './../commonStyles';
import imageMapper from './../images/imageMapper';
import Service from '../services/http';
import Page from '../components/Page';
import {useStateValue} from '../store/store';
import {StackActions} from '@react-navigation/native';

const services = new Service();

function ForgotPassword(props) {
	const {navigation} = props;
	const [email, setEmail] = React.useState('');
	const [state, dispatch] = useStateValue();

	const handleEmail = React.useCallback((value) => {
		setEmail(value);
	}, []);

	const handleResetPassword = React.useCallback(() => {
		if (email) {
			dispatch({type: 'SET_LOADING', loading: true});
			const url = `?action=forgotPassword&Email=${email}`;
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
					Alert.alert('Network Error', res.res[0]);
				}
			});
		} else {
			Alert.alert('Validation Error', 'Email/Number is required');
		}
	}, [email, navigation, dispatch]);

	const handleBack = React.useCallback(() => {
		navigation.goBack();
	}, [navigation]);

	return (
		<Page>
			<View
				style={[
					commonStyles.pageStyle,
					styles.container,
					commonStyles.largePageSize,
				]}>
				<TouchableOpacity style={styles.backIconView} onPress={handleBack}>
					<Image source={imageMapper.back.source} style={styles.backIcon} />
				</TouchableOpacity>
				<Image
					source={imageMapper.orangeLock.source}
					style={styles.imageLogo}
				/>
				<Typography variant="title2" style={styles.welcomeText}>
					Forgot Password
				</Typography>
				<Typography variant="body" style={styles.description}>
					Provide your account's email for which you want to reset your
					password!
				</Typography>
				<Input
					style={styles.input}
					value={email}
					placeholder="Enter your email id"
					onChange={handleEmail}
				/>
				<Button
					style={styles.resetButton}
					title="NEXT"
					onPress={handleResetPassword}
				/>
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
		width: 52,
		height: 68,
		alignSelf: 'center',
	},
	input: {
		marginTop: 10,
		marginBottom: 10,
	},
	welcomeText: {
		alignSelf: 'center',
		marginTop: 20,
		marginBottom: 20,
	},
	description: {
		textAlign: 'center',
		marginLeft: 7,
		marginRight: 7,
		fontWeight: 'normal',
		marginBottom: 25,
		color: '#66837B',
	},
	resetButton: {
		marginTop: 25,
	},
	backIcon: {
		tintColor: '#003124',
		width: 16,
		height: 16,
	},
	backIconView: {
		position: 'absolute',
		top: 30,
		padding: 12,
		left: 20,
	},
});

export default ForgotPassword;
