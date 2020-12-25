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
import Typography from './../../components/Typography';
import Input from './../../components/Input';
import Button from './../../components/Button';

import commonStyles from './../../commonStyles';
import imageMapper from './../../images/imageMapper';
import {StackActions} from '@react-navigation/native';
import Service from '../../services/http';
import Page from '../../components/Page';
import {useStateValue} from '../../store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScrollablePageView from '../../components/ScrollablePageView';

const services = new Service();

function Header(props) {
	const {navigation} = props;
	return (
		<View style={styles.headerView}>
			<TouchableOpacity
				style={styles.backButton}
				onPress={() => navigation.goBack()}>
				<Image source={imageMapper.back.source} style={styles.backIcon} />
			</TouchableOpacity>
			<Typography variant="title2" style={styles.profileTitle}>
				Checkout
			</Typography>
			<View />
		</View>
	);
}

function PaymentForm(props) {
	const {navigation} = props;
	const [state, dispatch] = useStateValue();
	const [credential, setCredential] = React.useState({});
	// const [load]
	const handleChange = React.useCallback((key, value) => {
		setCredential((c) => {
			return {...c, [key]: value};
		});
	}, []);

	const handleBack = React.useCallback(() => {
		navigation.goBack();
	}, [navigation]);

	const handlePayment = React.useCallback(() => {
		Alert.alert('In Progress', 'Payment is under progress');
		// http://carinait.net/AudioBook/AudioBookWebservices/webservices/index.php?action=PurchaseBook&BooKID=1&CustomerID=1&Price=10&Status=1

	}, []);

	return (
		<ScrollablePageView
			header={<Header navigation={navigation} state={state} />}
			bottomBar={
				<Button
					title="PAY NOW"
					style={styles.continueButton}
					onPress={handlePayment}
				/>
			}>
			<View style={styles.content}>
				<Input
					style={styles.input}
					value={credential.number}
					placeholder="Card Number"
					label="Card Number"
					onChange={(value) => handleChange('Number', value)}
					left={true}
				/>
				<Input
					style={styles.input}
					value={credential.MobileNumber}
					placeholder="Name on card"
					label="Name on card"
					onChange={(value) => handleChange('CardName', value)}
				/>
			</View>
		</ScrollablePageView>
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
	headerView: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 36,
		paddingLeft: 26,
	},
	profileTitle: {
		color: '#003124',
	},
	backIcon: {
		width: 16,
		height: 16,
		marginTop: 5,
	},
	content: {
		marginLeft: 36,
		marginRight: 36,
	},
	continueButton: {
		margin: 36,
		marginTop: 2,
		marginBottom: 10,
	},
	backButton: {
		paddingRight: 10,
		paddingLeft: 10,
	},
});

export default PaymentForm;
