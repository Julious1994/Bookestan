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
import Icon from 'react-native-vector-icons/MaterialIcons';
import PaymentSuccess from './PaymentSuccess';

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
				My Cart
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
		navigation.dispatch(StackActions.push('PaypalPayment', {amount: total}));
	}, [navigation, total]);

	const handleDelete = React.useCallback(
		(index) => {
			dispatch({type: 'REMOVE_CART', index});
		},
		[dispatch],
	);

	return (
		<ScrollablePageView
			header={<Header navigation={navigation} state={state} />}
			bottomBar={
				<Button
					title="Pay Now"
					style={styles.continueButton}
					onPress={handleContinue}
				/>
			}>
			<View style={styles.content}>
				{state.cart.map((cartItem, i) => (
					<View key={i} style={styles.cartItemView}>
						<View>
							<View style={[styles.imageView]} elevation={3}>
								<Image
									source={{uri: cartItem.CoverImagePath}}
									style={[styles.image]}
								/>
							</View>
						</View>
						<View style={styles.infoView}>
							<View style={styles.upperRow}>
								<View>
									<Typography variant="title3" style={styles.title}>
										{cartItem.Title}
									</Typography>
									<Typography variant="description" style={styles.author}>
										{cartItem.Author}
									</Typography>
								</View>
								<TouchableOpacity onPress={() => handleDelete(i)}>
									<View style={styles.cancelIcon}>
										<Icon name="close" color="#66837B" />
									</View>
								</TouchableOpacity>
							</View>
							<View style={styles.lowerRow}>
								<View />
								<Typography variant="title3">{`$ ${cartItem.Price}`}</Typography>
							</View>
						</View>
					</View>
				))}
				<View style={styles.totalView}>
					<Typography variant="title3" style={styles.totalText}>
						Total
					</Typography>
					<Typography variant="title2" style={styles.total}>
						{`$ ${total}`}
					</Typography>
				</View>
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
