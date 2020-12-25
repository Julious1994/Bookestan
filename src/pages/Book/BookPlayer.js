import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Typography from './../../components/Typography';
import imageMapper from './../../images/imageMapper';
import Service from '../../services/http';
import {useStateValue} from '../../store/store';
import {StackActions} from '@react-navigation/native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';

const services = new Service();

function Header(props) {
	const {navigation} = props;
	return (
		<View style={styles.headerView}>
			<TouchableOpacity onPress={() => navigation.goBack()}>
				<Image source={imageMapper.back.source} style={styles.backIcon} />
			</TouchableOpacity>
			<Typography variant="title2" style={styles.profileTitle}>
				My Cart
			</Typography>
			<View />
		</View>
	);
}

function BookPlayer(props) {
	const {navigation, route} = props;
	const {book = {}} = route.params;

	const [state, dispatch] = useStateValue();
	const total = state.cart.reduce((t, item) => {
		return t + Number(item.Price);
	}, 0);

	const handleContinue = React.useCallback(() => {
		navigation.dispatch(StackActions.push('Payment'));
	}, [navigation]);
	const handleDelete = React.useCallback(
		(index) => {
			dispatch({type: 'REMOVE_CART', index});
		},
		[dispatch],
	);

	React.useEffect(() => {
		const index = state.listenedBooks.findIndex(
			(l) => l.BookID === book.BookID,
		);
		if (book.BookID && index === -1) {
			services
				.post(
					`?action=ListenAudioBook&BooKID=${book.BookID}&CustomerID=${state.user.CustomerID}&SNo=${book.SNo}`,
				)
				.then((res) => {
					console.log(res);
				});
		}
	}, [book, state.user, state.listenedBooks]);

	if (!book.BookPath) {
		return null;
	}
	console.log('book', book);
	return (
		<React.Fragment>
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backIcon}
					onPress={() => navigation.goBack()}>
					<Icon style={styles.backIcon} name="arrow-back" size={24} />
				</TouchableOpacity>
				<Typography variant="title3" lines={1} style={styles.title}>
					{book.Name}
				</Typography>
			</View>
			<Video
				poster={book.CoverImagePath}
				controls={true}
				posterResizeMode="cover"
				resizeMode="cover"
				source={{uri: book.BookPath}}
				style={styles.videoView}
			/>
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	videoView: {
		position: 'absolute',
		top: 50,
		left: 0,
		bottom: 0,
		right: 0,
		backgroundColor: '#000',
	},
	header: {
		padding: 10,
		backgroundColor: 'rgba(245, 250, 249, 1)',
		left: 0,
		right: 0,
		top: 0,
		height: 50,
		display: 'flex',
		flexDirection: 'row',
		// justifyContent: 'space-between',
	},
	backIcon: {
		paddingTop: 2,
		paddingRight: 20,
	},
	title: {
		flex: 1,
	},
});

export default BookPlayer;
