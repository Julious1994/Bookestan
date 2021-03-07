import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import commonStyles from '../../commonStyles';
import Typography from '../../components/Typography';
import BottomBar from '../BottomBar';
import {useStateValue} from '../../store/store';
import imageMapper from './../../images/imageMapper';
import Service from '../../services/http';
import LinearGradient from 'react-native-linear-gradient';
import {StackActions} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getInitial} from '../../utils';
import {logout} from './Logout';

function Setting(props) {
	const {navigation} = props;
	const [state, dispatch] = useStateValue();

	const handleChangePassword = React.useCallback(() => {
		navigation.dispatch(StackActions.push('ChangePassword'));
	}, [navigation]);

	const handleEditProfile = React.useCallback(() => {
		navigation.dispatch(StackActions.push('EditProfile'));
	}, [navigation]);

	const handleSubscribe = React.useCallback(() => {
		navigation.dispatch(StackActions.push('Subscribe'));
	}, [navigation]);

	const handleLogout = React.useCallback(() => {
		logout(navigation);
	}, [navigation]);

	return (
		<View style={commonStyles.pageStyle}>
			<LinearGradient
				colors={['rgba(8, 111, 83, 1)', 'rgba(10, 138, 103, 1)']}
				style={[styles.linearGradient, styles.headerContainer]}>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={styles.settingButton}>
					<Image source={imageMapper.back.source} style={styles.backIcon} />
				</TouchableOpacity>
				<Typography variant="title2" style={styles.profileTitle}>
					Account Setting
				</Typography>
				<View />
			</LinearGradient>
			<View style={styles.content}>
				<View style={styles.avatar}>
					<Text style={styles.initialText}>{getInitial(state?.user.Name)}</Text>
				</View>
				<View>
					<Typography variant="title2" style={styles.userName}>
						{state.user?.Name}
					</Typography>
				</View>
				<View style={styles.optionContainer}>
					<View style={styles.optionView}>
						<Icon name="person" size={24} />
						<Typography
							variant="title3"
							containerStyle={styles.optionTitleContainer}
							style={styles.optionTitle}>
							Personal Info
						</Typography>
						<TouchableOpacity
							style={styles.editProfileButton}
							onPress={handleEditProfile}>
							<Typography variant="body" style={styles.editProfileText}>
								Edit Profile
							</Typography>
						</TouchableOpacity>
					</View>
					<View style={styles.optionView}>
						<TouchableOpacity
							style={styles.changePasswordIcon}
							onPress={handleChangePassword}>
							<Icon name="lock" size={24} />
							<Typography
								variant="title3"
								containerStyle={styles.optionTitleContainer}
								style={styles.optionTitle}>
								Change Password
							</Typography>
							<Icon name="chevron-right" size={24} />
						</TouchableOpacity>
					</View>
					<View style={styles.optionView}>
						<TouchableOpacity
							style={styles.changePasswordIcon}
							onPress={handleSubscribe}>
							<Icon name="credit-card" size={24} />
							<Typography
								variant="title3"
								containerStyle={styles.optionTitleContainer}
								style={styles.optionTitle}>
								My Subscription
							</Typography>
							<Icon name="chevron-right" size={24} />
						</TouchableOpacity>
					</View>
					<View style={[styles.optionView, styles.noBorder]}>
						<TouchableOpacity
							style={styles.changePasswordIcon}
							onPress={handleLogout}>
							<Icon name="exit-to-app" size={24} />
							<Typography
								variant="title3"
								containerStyle={styles.optionTitleContainer}
								style={styles.optionTitle}>
								Logout
							</Typography>
							<View />
						</TouchableOpacity>
					</View>
				</View>
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
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: 36,
		paddingRight: 36,
		paddingTop: 25,
		height: 150,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
	profileTitle: {
		color: '#fff',
	},
	content: {height: '64%', position: 'relative', paddingTop: 60},
	userName: {
		alignSelf: 'center',
		marginTop: 5,
		marginBottom: 15,
		color: 'rgba(8, 111, 83, 1)',
	},
	optionContainer: {
		paddingLeft: 36,
		paddingRight: 36,
	},
	optionView: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(112, 112, 112, 0.1)',
		padding: 10,
		paddingTop: 20,
		paddingBottom: 20,
	},
	noBorder: {
		borderBottomWidth: 0,
	},
	optionIcon: {
		// backgroundColor: 'red',
	},
	optionTitleContainer: {
		flex: 1,
	},
	optionTitle: {
		marginLeft: 15,
		flex: 1,
		textAlign: 'left',
		fontWeight: 'normal',
		lineHeight: 25,
		// backgroundColor: 'red',
	},
	changePwdIcon: {},
	editProfileButton: {
		borderColor: 'rgba(102, 131, 123, 0.2)',
		borderWidth: 0.5,
		borderRadius: 5,
		padding: 15,
		paddingTop: 4,
		paddingBottom: 4,
	},
	editProfileText: {
		color: 'rgba(255, 128, 0, 1)',
		fontSize: 10,
	},
	changePasswordIcon: {
		display: 'flex',
		flexDirection: 'row',
		// justifyContent: 'space-between',
		width: '100%',
	},
	avatar: {
		top: -95,
		position: 'absolute',
		marginTop: 25,
		width: 128,
		height: 128,
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
});

export default Setting;
