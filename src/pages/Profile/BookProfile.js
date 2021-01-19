import React from 'react';
import {
	View,
	Text,
	Image,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Dimensions,
	ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import Tab from '../../components/Tab';
import commonStyles from '../../commonStyles';
import Typography from '../../components/Typography';
import BottomBar from '../BottomBar';
import {useStateValue} from '../../store/store';
import imageMapper from './../../images/imageMapper';
import Service from '../../services/http';
import LinearGradient from 'react-native-linear-gradient';
import {StackActions} from '@react-navigation/native';
import {getInitial} from '../../utils';

const services = new Service();

const tabs = [{title: 'Listened'}, {title: 'Purchased'}, {title: 'Likes'}];
const ScreenWidth = Dimensions.get('window').width;
const bookLength = (ScreenWidth - 72) / 2;

function BookProfile(props) {
	const {navigation} = props;
	const [activeTab, setActiveTab] = React.useState(1);
	const [state, dispatch] = useStateValue();
	const [loading, setLoading] = React.useState(false);
	const [data, setData] = React.useState([]);

	const handleSetting = React.useCallback(() => {
		navigation.dispatch(StackActions.push('SettingScreen'));
	}, [navigation]);

	const fetchData = React.useCallback(async () => {
		setLoading(true);
		switch (activeTab) {
			case 0: {
				const listened = await services.get(
					`?action=DisplayListendAudioBook&CustomerID=${state.user.CustomerID}`,
				);
				if (listened.success === '1') {
					setData([...listened.data]);
				}
				break;
			}
			case 1: {
				const purchased = await services.get(
					`?action=PurchaseBookListbyCustomerId&CustomerID=${state.user.CustomerID}`,
				);
				if (purchased.success === '1') {
					setData([...purchased.data]);
				}
				break;
			}
			case 2: {
				const liked = await services.get(
					`?action=BookLikeHistoryByCustomerID&CustomerID=${state.user.CustomerID}`,
				);
				if (liked.success === '1') {
					setData([...liked.data]);
				}
				break;
			}

			default: {
				break;
			}
		}
		setLoading(false);
	}, [setLoading, state.user, activeTab]);

	const handleBook = React.useCallback(
		(book) => {
			let purchased = {};
			if(activeTab !== 2) {
				purchased = {purchased: true}
			}
			navigation.dispatch(
				StackActions.push('BookView', {book, ...purchased}),
			);
		},
		[navigation, activeTab],
	);

	React.useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<View style={[commonStyles.pageStyle, {position: 'relative'}]}>
			<LinearGradient
				colors={['rgba(8, 111, 83, 1)', 'rgba(10, 138, 103, 1)']}
				style={[styles.linearGradient, styles.headerContainer]}>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={styles.settingButton}>
					<Image source={imageMapper.back.source} style={styles.backIcon} />
				</TouchableOpacity>
				<Typography variant="title2" style={styles.profileTitle}>
					My Profile
				</Typography>
				<TouchableOpacity onPress={handleSetting} style={styles.settingButton}>
					<Image
						source={imageMapper.setting.source}
						style={styles.settingIcon}
					/>
				</TouchableOpacity>
			</LinearGradient>
			<View style={styles.contentContainer}>
				<View style={styles.avatar}>
					<Text style={styles.initialText}>{getInitial(state?.user.Name)}</Text>
				</View>
				<Typography variant="title2" style={styles.userName}>
					{state.user?.Name}
				</Typography>
				<View style={[commonStyles.compactPageStyle, styles.tabContainer]}>
					{tabs.map((tab, i) => (
						<Tab
							key={i}
							title={tab.title}
							active={i === activeTab}
							onPress={() => setActiveTab(i)}
						/>
					))}
				</View>
				<ScrollView style={{height: '49%'}}>
					{loading ? (
						<ActivityIndicator
							style={styles.loader}
							size="large"
							color="#086F53"
						/>
					) : (
						<View style={styles.bookListView}>
							{data.map((item, i) => (
								<TouchableOpacity
									key={i}
									style={[styles.bookItemView, {width: bookLength}]}
									onPress={() => handleBook(item)}>
									<View
										style={[styles.imageView, {width: bookLength}]}
										elevation={5}>
										<Image
											source={{
												uri: item.CoverImagePath,
											}}
											style={[styles.image, {width: bookLength - 2}]}
										/>
									</View>
									<Typography
										lines={1}
										variant="title3"
										style={styles.bookName}>
										{item.Title}
									</Typography>
									<Typography>
										{moment(item.PublishDate).format('MMM DD / YYYY')}
									</Typography>
								</TouchableOpacity>
							))}
						</View>
					)}
				</ScrollView>
			</View>
			<BottomBar navigation={navigation} />
		</View>
	);
}

const styles = StyleSheet.create({
	tabContainer: {
		display: 'flex',
		flexDirection: 'row',
	},
	contentContainer: {
		marginLeft: 18,
		marginRight: 18,
		position: 'relative',
		paddingTop: 70,
	},
	bookName: {
		color: '#000',
	},
	bookItemView: {
		marginTop: 10,
		marginLeft: 9,
		marginRight: 9,
	},
	image: {
		width: 140,
		height: 213,
		borderRadius: 5,
	},
	imageView: {
		borderRadius: 5,
		width: 142,
		shadowColor: '#000',
		shadowOpacity: 1,
		shadowRadius: 2,
		shadowOffset: {
			height: 1,
			width: 5,
		},
	},
	bookListView: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		// justifyContent: 'space-around',
	},
	userName: {
		alignSelf: 'center',
		marginBottom: 10,
		color: 'rgba(8, 111, 83, 1)',
	},
	settingIcon: {
		width: 16,
		height: 16,
	},
	backIcon: {
		width: 16,
		height: 16,
		tintColor: '#fff',
	},
	settingButton: {
		padding: 10,
		paddingTop: 5,
	},
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
	loader: {
		alignSelf: 'center',
		marginTop: 30,
	},
});

export default BookProfile;
