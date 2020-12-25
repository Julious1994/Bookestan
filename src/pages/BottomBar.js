import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Typography from './../components/Typography';
import imageMapper from './../images/imageMapper';
import {StackActions} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

function ProfileView({active}) {
	return (
		<View style={[styles.profileImageView]}>
			<Image
				style={[styles.profileImage, active && styles.activeProfileImage]}
				resizeMode="cover"
				source={imageMapper.moviePhoto2.source}
			/>
		</View>
	);
}

const shadowOpt = {
	width: 0,
	height: 0,
	color: '#000',
	border: 2,
	radius: 3,
	opacity: 0.2,
	x: 0,
	y: 3,
	style: {marginVertical: 5, width: '100%'},
};

function MenuItem(props) {
	const Component = props.component;
	return (
		<TouchableOpacity style={[styles.menuItem]} onPress={props.onPress}>
			{props.image && (
				<Image
					source={imageMapper[props.image].source}
					style={[styles.menuImage, props.active && styles.activeMenu]}
					resizeMode="contain"
				/>
			)}
			{props.component && <Component active={props.active} />}
			<Typography
				variant="tiny2"
				style={[styles.menuTitle, props.active && styles.activeTitle]}>
				{props.title}
			</Typography>
		</TouchableOpacity>
	);
}

const menus = [
	{title: 'HOME', page: 'Home', image: 'home'},
	// {title: 'CATEGORIES', image: 'categories'},
	// {title: 'MY LIBRARY', page: 'Library', image: 'categories'},
	{title: 'PROFILE', page: 'BookProfile', image: 'profile'},
];

function BottomBar(props) {
	const {navigation} = props;
	const handleRedirect = React.useCallback(
		(page) => {
			page && navigation.dispatch(StackActions.push(page));
		},
		[navigation],
	);

	return (
		// <BoxShadow setting={shadowOpt}>
		<LinearGradient
			// start={{x: 0.33, y: 0}}
			// end={{x: 0.66, y: 0}}
			colors={['#0A8A67', '#086F53']}
			style={[styles.linearGradient, styles.container]}>
			{menus.map((menu, i) => (
				<MenuItem
					key={i}
					image={menu.image}
					component={menu.Component}
					active={props.active === i}
					title={menu.title}
					onPress={() => handleRedirect(menu.page)}
				/>
			))}
		</LinearGradient>
		// </BoxShadow>
	);
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		padding: 10,
		paddingTop: 15,
		// backgroundColor: '#086F53',
		marginTop: 0,
		shadowColor: 'red',
		shadowOffset: {
			width: 0,
			height: -3,
		},
		shadowRadius: 2,
		// shadowOpacity: 1,
		elevation: 4,
	},
	menuImage: {
		width: 18,
		height: 18,
		tintColor: 'rgba(255, 255, 255, 1)',
	},
	menuTitle: {
		fontSize: 9,
		marginTop: 5,
		color: '#fff',
		opacity: 0.5,
	},
	menuItem: {
		flex: 1,
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	profileImageView: {
		alignSelf: 'center',
	},
	profileImage: {
		borderRadius: 76,
		width: 24,
		height: 24,
		borderColor: 'rgba(255, 255, 255, 0.3)',
		borderWidth: 1,
	},
	activeProfileImage: {
		borderColor: '#159AEA',
	},
	activeMenu: {
		tintColor: '#fff',
	},
	activeTitle: {
		color: '#fff',
		opacity: 0.5,
	},
});

export default BottomBar;
