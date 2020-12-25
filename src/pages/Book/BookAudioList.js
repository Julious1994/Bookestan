import React from 'react';
import {
	View,
	Text,
	Alert,
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
import Service from '../../services/http';
import ScrollablePageView from '../../components/ScrollablePageView';
import {useStateValue} from '../../store/store';
import {StackActions} from '@react-navigation/native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

function BookAudioList(props) {
	const {navigation, route} = props;
	const {bookDetails = {}} = route.params;

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
	const handlePlay = React.useCallback(
		(audio) => {
			navigation.dispatch(
				StackActions.push('BookPlayer', {
					book: {
						...audio,
						CoverImagePath: bookDetails.CoverImagePath,
						BookID: bookDetails.BookID,
					},
				}),
			);
		},
		[navigation, bookDetails],
	);

	return (
		<React.Fragment>
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backIcon}
					onPress={() => navigation.goBack()}>
					<Icon style={styles.backIcon} name="arrow-back" size={24} />
				</TouchableOpacity>
				<Typography variant="title3" lines={1} style={styles.title}>
					{bookDetails.Title}
				</Typography>
			</View>
			{bookDetails.audioList.map((audio, i) => (
				<TouchableOpacity
					style={styles.listItem}
					key={i}
					onPress={() => handlePlay(audio)}>
					<Typography variant="title3" style={styles.partText}>
						Part {i + 1}
					</Typography>
					<Typography
						lines={1}
						variant="title3"
						containerStyle={styles.partTitle}>
						{audio.Name}
					</Typography>
					<Icon
						name="play-circle-filled"
						size={32}
						color="green"
						style={styles.partPlayButton}
					/>
				</TouchableOpacity>
			))}
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
	listItem: {
		display: 'flex',
		flexDirection: 'row',
		padding: 10,
		marginRight: 15,
		marginLeft: 15,
		borderBottomColor: 'rgba(102, 131, 123, 0.2)',
		borderBottomWidth: 1,
	},
	partText: {
		width: 75,
	},
	partTitle: {
		flex: 1,
		marginLeft: 5,
	},
	partPlayButton: {
		width: 50,
		// backgroundColor: 'red',
	},
	noBorder: {
		borderBottomWidth: 0,
	},
});

export default BookAudioList;
