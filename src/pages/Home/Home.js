import React from 'react';
import {
	View,
	Text,
	Image,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	TextInput,
	ActivityIndicator,
} from 'react-native';
import {StackActions} from '@react-navigation/native';
import {useDebounce} from '@react-hook/debounce';

import Typography from '../../components/Typography';
import HorizontalList from '../../components/HorizontalList';
import ScrollablePageView from '../../components/ScrollablePageView';
import BottomBar from '../BottomBar';
import {useStateValue} from '../../store/store';
import imageMapper from './../../images/imageMapper';
import Service from '../../services/http';

const tabs = [{title: 'Listened'}, {title: 'Purchased'}, {title: 'Likes'}];
const ScreenWidth = Dimensions.get('window').width;
const bookLength = (ScreenWidth - 72) / 2;

const services = new Service();

const getBooks = (books, purchasedBooks) => {
	return books.filter(
		(b) => purchasedBooks.findIndex((book) => book.BookID === b.BookID) === -1,
	);
};

function Header(props) {
	const {navigation, state, dispatch} = props;
	const handleCart = React.useCallback(() => {
		navigation.dispatch(StackActions.push('Cart'));
	}, [navigation]);

	const handleMenu = React.useCallback(() => {
		dispatch({type: 'TOGGELE_DRAWER'});
	}, [dispatch]);

	const handleNotification = React.useCallback(() => {}, [navigation]);

	return (
		<View style={styles.headerContainer}>
			<View style={styles.leftMenu}>
				<TouchableOpacity
					style={[styles.menuItemView, styles.appMenu]}
					onPress={handleMenu}>
					<Image source={imageMapper.menu.source} style={styles.menuItemIcon} />
				</TouchableOpacity>
			</View>
			<View style={styles.rightMenu}>
				{/* <TouchableOpacity
					style={styles.rightMenuItemView}
					onPress={handleNotification}>
					<Image
						source={imageMapper.cart.source}
						style={styles.rightMenuItemIcon}
					/>
				</TouchableOpacity> */}
				<TouchableOpacity style={styles.rightMenuItemView} onPress={handleCart}>
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
			</View>
		</View>
	);
}

function Home(props) {
	const {navigation} = props;
	const [activeTab, setActiveTab] = React.useState(0);
	const [search, setSearch] = useDebounce('');
	const [books, setBooks] = React.useState([]);
	const [loading, setLoading] = React.useState(false);

	const [state, dispatch] = useStateValue();
	const {user} = state;
	// const data = [...Array(10).keys()];
	console.log(state.user);

	const fetchLikes = React.useCallback(() => {
		services
			.get(`?action=BookLikeHistoryByCustomerID&CustomerID=${user.CustomerID}`)
			.then((res) => {
				if (res.data && Array.isArray(res.data)) {
					dispatch({type: 'SET_LIKES', data: res.data});
				}
			});
	}, [dispatch, user]);

	const fetchData = React.useCallback(async () => {
		const listened = await services.get(
			`?action=DisplayListendAudioBook&CustomerID=${state.user.CustomerID}`,
		);
		if (listened.success === '1') {
			dispatch({type: 'SET_LISTENED', data: [...listened.data]});
		}
		const purchased = await services.get(
			`?action=PurchaseBookListbyCustomerId&CustomerID=${state.user.CustomerID}`,
		);
		if (purchased.success === '1') {
			dispatch({type: 'SET_PURCHASED', data: [...purchased.data]});
		}
	}, [dispatch, state.user]);

	const fetchBooks = React.useCallback(() => {
		setLoading(true);
		services.get('?action=CategoryList').then(async (res) => {
			const list = [];
			if (Array.isArray(res.data)) {
				const categories = [...res.data];
				for (let i = 0; i < categories.length; i++) {
					const category = categories[i];
					const audioBooks = await services.get(
						`?action=SearchBookByCategory&CategoryID=${category.CategoryId}`,
					);
					if (Array.isArray(audioBooks.data) && audioBooks.data.length) {
						const bookList = ['', null, undefined].includes(search)
							? [...audioBooks.data]
							: audioBooks.data.filter((b) => b.Title.indexOf(search) !== -1);
						if (bookList.length > 0) {
							list.push({
								...category,
								books: [...bookList],
							});
						}
					}
				}
				setBooks([...list]);
				setLoading(false);
			} else {
				setLoading(false);
				setBooks([...list]);
			}
		});
		// services.get(`?action=SearchBookByTitle&Title=${search}`).then((res) => {
		// 	const {data = []} = res;
		// 	setLoading(false);
		// 	if (Array.isArray(data)) {
		// 		setBooks([...data]);
		// 	}
		// });
	}, [search]);

	// React.useEffect(() => {
	// 	// dispatch({type: 'SET_LOADING', loading: false});
	// 	services.get('DisplayCategoryList').then(async (categories) => {
	// 		const list = [];
	// 		for (let i = 0; i < categories.length; i++) {
	// 			const category = categories[i];
	// 			const videos = await services.get(
	// 				`DisplayVideoList?CategoryId=${category.CategoryId}`,
	// 			);
	// 			if (videos.length) {
	// 				list.push({
	// 					...category,
	// 					videos,
	// 				});
	// 			}
	// 		}
	// 		setVideoList([...list]);
	// 	});
	// }, [dispatch]);

	React.useEffect(() => {
		fetchBooks();
		fetchLikes();
		fetchData();
	}, [fetchBooks, fetchLikes, fetchData]);

	const handleBookPress = React.useCallback(
		(item, i) => {
			navigation.dispatch(StackActions.push('BookView', {book: {...item}}));
		},
		[navigation],
	);
	return (
		<ScrollablePageView
			navigation={navigation}
			dispatch={dispatch}
			header={
				<Header
					dispatch={dispatch}
					navigation={navigation}
					bottomBar={<BottomBar navigation={navigation} />}
					state={state}
				/>
			}
			bottomBar={<BottomBar navigation={navigation} />}>
			<View style={styles.homeInfo}>
				<View style={styles.homeTitle}>
					<Typography variant="title2" style={styles.titleText}>
						Hello,
					</Typography>
					<Typography variant="title2" style={styles.personName}>
						{state.user?.Name}
					</Typography>
				</View>
				<Typography variant="title1">Have a Nice Day!</Typography>
				<View style={styles.searchView}>
					<TextInput
						style={styles.searchInput}
						onChangeText={(txt) => setSearch(txt)}
					/>
					<Image source={imageMapper.search.source} style={styles.searchIcon} />
				</View>
			</View>
			<View style={styles.bookContent}>
				{loading ? (
					<ActivityIndicator
						style={styles.loader}
						size="large"
						color="#086F53"
					/>
				) : (
					books.map((book, i) => (
						<HorizontalList
							key={i}
							title={book.CategoryName}
							data={getBooks(book.books, state.purchasedBooks)}
							onPress={handleBookPress}
						/>
					))
				)}
			</View>
		</ScrollablePageView>
	);
}

const styles = StyleSheet.create({
	tabContainer: {
		display: 'flex',
		flexDirection: 'row',
	},

	// header css
	headerContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		margin: 36,
		marginBottom: 18,
	},
	appMenu: {
		paddingRight: 10,
		paddingTop: 5,
	},
	rightMenu: {
		display: 'flex',
		flexDirection: 'row',
	},
	leftMenu: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	menuItemIcon: {
		width: 16,
		height: 14,
	},
	menuItemView: {},
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
		position: 'relative',
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
	homeInfo: {
		marginLeft: 36,
		marginRight: 36,
	},
	homeTitle: {
		display: 'flex',
		flexDirection: 'row',
	},
	titleText: {
		fontWeight: 'normal',
		color: '#66837B',
	},
	personName: {
		fontWeight: 'normal',
		color: 'rgba(255, 128, 0, 1)',
	},
	searchIcon: {
		width: 16,
		height: 16,
		marginTop: 16,
	},
	searchInput: {
		flex: 1,
	},
	searchView: {
		paddingLeft: 12,
		paddingRight: 16,
		borderRadius: 40,
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: '#fff',
		width: '100%',
		elevation: 4,
		marginTop: 16,
		marginBottom: 10,
	},
	bookContent: {
		marginLeft: 32,
		marginBottom: 10,
	},
	loader: {
		alignSelf: 'center',
		color: 'red',
		marginTop: 30,
	},
});

export default Home;
