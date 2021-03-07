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
import Page from '../../components/Page';
import {useStateValue} from '../../store/store';
import {StackActions} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AudioPlayer from 'react-native-sound-player';
import Loader from '../../components/Loader';
import {isExpired} from "../../utils";

const services = new Service();

const getUri = (item, i) => {
	return {uri: `${item.CoverImagePath}`};
};

function BookView(props) {
	const {navigation, route} = props;
	const [email, setEmail] = React.useState('');
	const [state, dispatch] = useStateValue();
	const [progress, setProgress] = React.useState(null);
	const [pause, setPause] = React.useState(true);
	const [showPlay, setShowPlay] = React.useState(false);
	const [bookDetails, setBookDetails] = React.useState({});
	const [loading, setLoading] = React.useState(false);

	const {book = {}, purchased = false} = route.params;
	// const {user} = state;

	const soundInterval = React.createRef();
	const soundRef = React.createRef();
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

	const handlePlay = React.useCallback(() => {
		if (pause) {
			AudioPlayer.play();
			setPause(false);
		} else {
			AudioPlayer.pause();
			setPause(true);
		}
	}, [pause]);

	const initInterval = React.useCallback(() => {
		soundInterval.current = setInterval(() => {
			if (!pause) {
				setProgress((p) => p + 1);
			}
		}, 1000);
	}, [soundInterval, pause]);

	const {cart} = state;
	const addToCart = React.useCallback(() => {
		const index = cart.findIndex((c) => c.BookID === bookDetails.BookID);
		if (index === -1) {
			dispatch({type: 'ADD_CART', payload: {...bookDetails, quantity: 1}});
		}
	}, [dispatch, bookDetails, cart]);

	const handleBuyNow = React.useCallback(() => {
		dispatch({type: 'SET_CART', payload: [{...bookDetails, quantity: 1}]});
		navigation.dispatch(
			StackActions.push('PaypalPayment', {amount: bookDetails.Price}),
		);
	}, [dispatch, bookDetails, navigation]);

	const handleCart = React.useCallback(() => {
		navigation.dispatch(StackActions.push('Cart'));
	}, [navigation]);

	const handleStar = React.useCallback((isAdd = true) => {
		console.log('clicked', bookDetails.BookID)
		services
			.post(
				`?action=LikeAudioBook&CustomerID=${state.user.CustomerID}&BooKID=${bookDetails.BookID}`,
			)
			.then((res) => {
				console.log(res);
				const actionType = isAdd ? 'ADD_LIKE' : 'REMOVE_LIKE';
				dispatch({type: actionType, data: {...bookDetails}});
				setBookDetails((_book) => {
					return {..._book, LikeCount: Number(_book.LikeCount) + (isAdd ? 1 : -1)};
				});
			});
	}, [state, bookDetails, dispatch]);

	const handleListen = React.useCallback(() => {
		if(isExpired(state.user.PlanExpire)) {
			navigation.dispatch(StackActions.push('Subscribe', {bookDetails}));
		} else {
			navigation.dispatch(StackActions.push('BookAudioList', {bookDetails}));
		}

	}, [bookDetails, navigation]);

	React.useEffect(() => {
		dispatch({type: 'SET_LOADING', loading: true});
		if (book.BookID) {
			services.get(`?action=BookDetail&BookID=${book.BookID}`).then((res) => {
				dispatch({type: 'SET_LOADING', loading: false});
				console.log(res);
				if (res.success === '1') {
					if (Array.isArray(res.data)) {
						setBookDetails({...res.data[0], audioList: [...res.BookDetail], tagList: [...res.TagList]});
					}
				} else {
					Alert.alert('Not found', 'Book not found');
				}
			});
		}
		if (book.TrailerPath) {
			AudioPlayer.loadUrl(book.TrailerPath);
		}
		const finishAudio = AudioPlayer.addEventListener('FinishedPlaying', () => {
			setPause(true);
		});
		const urlLoading = AudioPlayer.addEventListener(
			'FinishedLoadingURL',
			() => {
				AudioPlayer.getInfo().then((res) => {
					if (res?.duration >= 0) {
						setShowPlay(true);
					}
				});
			},
		);
		return () => {
			AudioPlayer.stop();
			AudioPlayer.unmount();
			urlLoading.remove();
			finishAudio.remove();
		};
	}, [book, dispatch]);

	const isLiked =
		state.likes.findIndex((l) => l.BookID === bookDetails.BookID) !== -1;
	console.log(bookDetails);
	return (
		<Page>
			<View style={[commonStyles.pageStyle, styles.container]}>
				<View style={styles.topView}>
					<TouchableOpacity style={styles.backIconView} onPress={handleBack}>
						<Image source={imageMapper.back.source} style={styles.backIcon} />
					</TouchableOpacity>
				</View>
				{/* {!purchased && (
					<TouchableOpacity
						style={styles.rightMenuItemView}
						onPress={handleCart}>
						<Image
							source={imageMapper.cart.source}
							style={styles.rightMenuItemIcon}
						/>
						{Boolean(state.cart.length) && (
							<View style={styles.tagView}>
								<Text style={styles.tagText}>{state.cart.length}</Text>
							</View>
						)}
					</TouchableOpacity>
				)} */}
				{bookDetails.BookID && (
					<View style={styles.content}>
						<Image
							source={getUri(bookDetails)}
							style={styles.bookImage}
							resizeMode="contain"
						/>
						{showPlay && !purchased && (
							<View style={styles.playView}>
								<TouchableOpacity onPress={handlePlay}>
									<Icon
										name={`${pause ? 'play' : 'pause'}-circle-filled`}
										size={60}
										color="green"
									/>
								</TouchableOpacity>
								{!purchased && <Text>Play Demo</Text>}
							</View>
						)}
						<Typography variant="title2" style={styles.title}>
							{bookDetails.Title}
						</Typography>
						{bookDetails.Author && (
							<Typography variant="body" style={styles.author}>
								{`by ${bookDetails.Author}`}
							</Typography>
						)}
						{
							bookDetails.tagList.length > 0 &&
							<View style={styles.tagsView}>
								{/* <Icon 	name="book" size={32} /> */}
								<Typography variant="body" style={styles.author}>{
									bookDetails.tagList.map(tag => tag.TagName).join(", ")
								}</Typography>
							</View>
						}
						{/* {bookDetails.Price && (
							<Typography variant="title3" style={styles.price}>
								{`$ ${bookDetails.Price}`}
							</Typography>
						)} */}
						<View style={styles.likeContainer}>
							{bookDetails.LikeCount !== undefined && (
								<Typography variant="description" style={styles.likeCountText}>
									{`${bookDetails.LikeCount}`}
								</Typography>
							)}
							{/* {isLiked ? (
								<Icon name="star" color="#66837B" size={32} />
							) : ( */}
								<TouchableOpacity onPress={() => handleStar(isLiked ? false : true)}>
									<Icon name={isLiked ? "star" : "star-border"} color="#66837B" size={32} />
								</TouchableOpacity>
							{/* )} */}
						</View>
						<View style={styles.contentView}>
							<View></View>
							<Typography variant="title2" style={styles.aboutText}>
								About The Book
							</Typography>
							<ScrollView style={{height: '42%'}}>
								<Typography variant="description" style={styles.description}>
									{bookDetails.Description}
								</Typography>
							</ScrollView>
						</View>

						<View style={styles.cartView}>
							{/* {!purchased ? (
								<React.Fragment>
									<TouchableOpacity
										style={styles.cartButton}
										onPress={addToCart}>
										<Image
											source={imageMapper.cart.source}
											style={styles.cartImage}
										/>
									</TouchableOpacity>
									<Button
										style={styles.buyButton}
										title={`Buy Now`}
										textStyle={styles.buyButtonText}
										onPress={handleBuyNow}
									/>
								</React.Fragment>
							) : ( */}
								<Button
									style={styles.buyButton}
									title={'Listen Now'}
									textStyle={styles.buyButtonText}
									onPress={handleListen}
								/>
							{/* )} */}
						</View>
					</View>
				)}
			</View>
		</Page>
	);
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'column',
	},
	topView: {
		height: 170,
		backgroundColor: 'rgba(8, 111, 83, 0.05)',
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
	title: {
		color: 'rgba(0, 49, 36, 1)',
		alignSelf: 'center',
	},
	author: {
		color: 'rgba(102, 131, 123, 1)',
		alignSelf: 'center',
		fontWeight: 'normal',
		marginTop: 5,
		fontStyle: 'italic',
	},
	price: {
		alignSelf: 'center',
	},
	content: {
		position: 'relative',
		paddingTop: 100,
		// backgroundColor: 'red',
	},
	bookImage: {
		position: 'absolute',
		width: 120,
		height: 160,
		top: -75,
		alignSelf: 'center',
		borderRadius: 5,
	},
	ratingView: {},
	ratingStar: {},
	optionsView: {},
	optionItem: {},
	optionText: {},
	optionImage: {},
	contentView: {
		marginLeft: 36,
		marginRight: 36,
	},
	aboutText: {
		marginBottom: 10,
	},
	description: {
		fontSize: 14,
	},
	cartView: {
		marginLeft: 36,
		marginRight: 36,
		marginTop: 5,
		display: 'flex',
		flexDirection: 'row',
	},
	cartButton: {
		height: 50,
		width: 50,
		borderWidth: 0.8,
		borderColor: 'rgba(102, 131, 123, 0.6)',
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		borderRadius: 5,
	},
	cartImage: {
		width: 20,
		height: 20,
	},
	buyButton: {
		marginLeft: 10,
		flex: 1,
	},
	buyButtonText: {
		fontWeight: '600',
	},
	playView: {
		position: 'absolute',
		right: 40,
		top: -30,
	},
	rightMenuItemIcon: {
		tintColor: '#000',
		width: 12,
		height: 12,
	},
	rightMenuItemView: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		width: 32,
		height: 32,
		borderRadius: 30,
		alignItems: 'center',
		marginLeft: 20,
		backgroundColor: 'rgba(8, 111, 83, 0.1)',
		position: 'absolute',
		right: 30,
		top: 32,
	},
	tagView: {
		position: 'absolute',
		backgroundColor: 'rgba(255, 128, 0, 1)',
		width: 12,
		height: 12,
		borderRadius: 12,
		top: -3,
		right: -1,
	},
	tagText: {
		fontSize: 8,
		alignSelf: 'center',
	},
	likeContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'center',
	},
	likeCountText: {
		marginLeft: 2,
		marginRight: 7,
	},
	tagsView: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
	}
});

export default BookView;
