import React from 'react';
import {
	View,
	Text,
	Alert,
	StyleSheet,
	Image,
	TouchableOpacity,
	ScrollView,
	SliderBase,
} from 'react-native';
import Typography from './../../../components/Typography';
import Input from './../../../components/Input';
import Button from './../../../components/Button';
import commonStyles from './../../../commonStyles';
import imageMapper from './../../../images/imageMapper';
import Service from '../../../services/http';
import {isExpired} from '../../../utils';

import ScrollablePageView from '../../../components/ScrollablePageView';
import {useStateValue} from '../../../store/store';
import {StackActions} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PaymentSuccess from './../PaymentSuccess';
import RNIap, {
    Product,
    ProductPurchase,
    PurchaseError,
    acknowledgePurchaseAndroid,
    purchaseErrorListener,
    purchaseUpdatedListener,
} from 'react-native-iap';
import moment from "moment";

const services = new Service();

const itemSkus = Platform.select({
    ios: [
	 'com.bookestan.19'
    ],
    android: [
     'com.bookestan.19'
    ]
   });
   

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
				My Subscription
			</Typography>
			<View />
		</View>
	);
}

function Cart(props) {
	const {navigation} = props;
	const [state, dispatch] = useStateValue();
	const total = state.cart.reduce((t, item) => {
		return t + Number(item.Price);
	}, 0);

	const handleContinue = React.useCallback(() => {
		// navigation.dispatch(StackActions.push('PaypalPayment', {amount: total}));
        getItems();
	}, [navigation, total]);

	const handleDelete = React.useCallback(
		(index) => {
			dispatch({type: 'REMOVE_CART', index});
		},
		[dispatch],
	);

    const getItems = async () => {
        try {
          console.log('itemSkus[0]', itemSkus[0]);
          const products = await RNIap.getProducts(itemSkus);
          console.log('Products[0]', products);
          RNIap.requestPurchase(itemSkus[0]);
        } catch (err) {
          console.log('getItems || purchase error => ', err);
        }
      };

	React.useEffect(() => {
		async function init() {
            const result = await RNIap.initConnection();
			console.log({result});
		}
		purchaseErrorListener(async (error) => {
			Alert.alert("Error", error.message);
		});
		RNIap.purchaseUpdatedListener(async (purchase) => {
			try {
				const receipt = purchase.transactionId;
				if(receipt) {
					if (state.user && state.user.CustomerID) {
						const response = await services.post(
						`?action=GetSubscription&CustomerID=${state.user.CustomerID}`,
						);
							console.log(response);
							if(response.res && response.status === 200) {
								Alert.alert("Success", response.res.data);
								navigation.dispatch(StackActions.replace('Home'));
							} else {
								Alert.alert("Failed", "Failed to purchase. Contact support team.");
							}
					}
				}
			} catch(err) {
				Alert.alert('Listener error', err.message);
			}
		});
		init();
	}, []);

	return (
		<ScrollablePageView
			header={<Header navigation={navigation} state={state} />}
			bottomBar={
				isExpired(state.user.PlanExpire) && <Button
					title="Subscribe Now"
					style={styles.continueButton}
					onPress={handleContinue}
				/>
			}>
			<View style={styles.content}>
				
				<View style={styles.totalView}>
					<Typography variant="title3" style={styles.totalText}>
						Current Subscription
					</Typography>
					<Typography variant="title2" style={styles.total}>
						{`$ 19.99/m`}
					</Typography>
				</View>
				{
					isExpired(state.user.PlanExpire) ?
                		<Typography variant="description">Plan expired {moment(state.user.PlanExpire).fromNow()}</Typography>
					:
                		<Typography variant="description">Subscription will expire {moment(state.user.PlanExpire).fromNow()}</Typography>
				}
			</View>
		</ScrollablePageView>
	);
}

const styles = StyleSheet.create({
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
	cartItemView: {
		borderTopColor: 'rgba(102, 131, 123, 0.2)',
		borderTopWidth: 0.5,
		paddingTop: 26,
		paddingBottom: 26,
		// backgroundColor: 'red',
		display: 'flex',
		flexDirection: 'row',
	},
	infoView: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		marginLeft: 10,
	},
	lowerRow: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	upperRow: {
		flex: 1,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	title: {
		flex: 1,
	},
	cancelIcon: {
		marginTop: 7,
		borderColor: '#66837B',
		borderWidth: 1,
		borderRadius: 16,
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		width: 16,
		height: 16,
	},
	image: {
		width: 80,
		height: 120,
		borderRadius: 5,
	},
	imageView: {
		borderRadius: 5,
		width: 82,
		shadowColor: '#000',
		shadowOpacity: 1,
		shadowRadius: 2,
		shadowOffset: {
			height: 1,
			width: 5,
		},
	},
	totalView: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	total: {
		marginTop: 3,
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
	author: {
		color: 'rgba(102, 131, 123, 1)',
	},
});

export default Cart;
