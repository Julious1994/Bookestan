import React from 'react';
import {WebView} from 'react-native-webview';
import {View, Platform, ActivityIndicator} from 'react-native';
import Loader from '../../components/Loader';
import PaymentSuccess from './PaymentSuccess';
import Service from '../../services/http';
import {useStateValue} from '../../store/store';
import {StackActions} from '@react-navigation/native';

// predesigned and styled html
const html = `
<input type="hidden" name="cmd" value="_ext-enter">
<form action="https://www.sandbox.paypal.com/-/us/cgi-bin/webscr" method="post">
   <input type="hidden" name="cmd" value="_xclick">
   <input type="hidden" name="business" value="aardinusa-facilitator@gmail.com">
   <input type="hidden" name="item_name" value="Books Payment">
   <input type="hidden" name="currency_code" value="USD">
   <input type="hidden" name="amount" value="10">
   <input type="image" src="https://www.sandbox.paypal.com/en_US/i/btn/x-click-but01.gif" name="submit" alt="Make payments with PayPal - it's fast, free and secure!">
</form>
	`;
const services = new Service();

function PayPal(props) {
	const {navigation, route} = props;
	const [state, dispatch] = useStateValue();
	const {amount} = route.params;
	const [done, setDone] = React.useState(false);

	const [loading, setLoading] = React.useState(true);
	const patchPostMessageFunction = function () {
		var originalPostMessage = window.postMessage;
		console.log(originalPostMessage);
		//   var patchedPostMessage = function(message, targetOrigin, transfer) {
		//     originalPostMessage(message, targetOrigin, transfer);
		//   };

		//   patchedPostMessage.toString = function() {
		//     return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
		//   };

		//   window.postMessage = patchedPostMessage;
	};

	const patchPostMessageJsCode =
		'(' + String(patchPostMessageFunction) + ')();';

	const handleDone = React.useCallback(async () => {
		setDone(false);
		setLoading(true);
		if (state.user && state.user.CustomerID) {
			let counter = state.cart.length;
			for (let i = 0; i < state.cart.length; i++) {
				const item = state.cart[i];
				if (item.BookID) {
					const response = await services.post(
						`?action=PurchaseBook&BooKID=${item.BookID}&CustomerID=${state.user.CustomerID}&Price=10&Status=1`,
					);
					if (response.success === '1') {
						counter--;
					}
				}
			}
			setLoading(false);
				navigation.dispatch(StackActions.replace('BookProfile'));

		}
		// ?action=PurchaseBook&BooKID=1&CustomerID=1&Price=10&Status=1
	}, [state.cart, state.user, navigation]);

	const handleNavigation = (event) => {
		console.log(event);
		if (event.url && event.url.indexOf('checkout/done') !== -1) {
			setTimeout(() => {
				setDone(true);
			}, 1500);
		}
	};
	function handleMessage(event) {
		console.log('cccc', event, event.nativeEvent.data);

		// let data = event.nativeEvent.data;
		// data = JSON.parse(data);
		// if(data.status == 'success'){
		//     alert(data.reference);

		// }else{
		//     this.setState({loading: false});
		//     alert('Failed, '+ data.message);

		// }
	}
	function passValues() {
		// const { amount, paypalFundingDetails} = this.props;

		// let data = {
		//     amount,
		//     orderID: paypalFundingDetails.result.id //orderID
		// }

		// if(!this.state.sent){
		//     this.refs.webview.postMessage(JSON.stringify(data));
		//     this.setState({loading: false, sent: true});
		// }
		console.log('end load');
		setLoading(false);
	}
	// const formData = new FormData();
	// formData.append('cmd', '_xclick');
	// formData.append('business', encodeURI('aardinusa-facilitator@gmail.com'));
	// formData.append('item_name', 'Books');
	// formData.append('currency_code', 'USD');
	// formData.append('amount', '10');

	// const url =
	// 	'cmd=_xclick&business=aardinusa-facilitator%40gmail.com&item_name=Books+Payment&currency_code=USD&amount=10&submit.x=28&submit.y=24';
	// console.log(url);
	// console.log(
	// 	`cmd=_xclick&business=${encodeURI(
	// 		'aardinusa-facilitator@gmail.com',
	// 	)}&item_name=Books&currency_code=USD&amount=10`,
	// );

	React.useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 5000);
	}, []);

	if (!amount) {
		return null;
	}
	return (
		<View style={{flex: 1}}>
			{loading && <Loader />}
			{done && <PaymentSuccess handleDone={handleDone} />}
			<WebView
				style={{overflow: 'scroll', backgroundColor: 'red'}}
				source={{
					uri: 'https://www.paypal.com/-/us/cgi-bin/webscr',
					method: 'post',
					body: `cmd=_xclick&business=aardinusa-facilitator%40gmail.com&item_name=Books+Payment&currency_code=USD&amount=${amount}&submit.x=28&submit.y=24`,
				}}
				originWhitelist={['*']}
				mixedContentMode={'always'}
				useWebKit={Platform.OS == 'ios'}
				onError={(e) => {
					alert('Error Occured', e);
				}}
				onLoadEnd={() => passValues()}
				// ref="webview"
				thirdPartyCookiesEnabled={true}
				scrollEnabled={true}
				domStorageEnabled={true}
				startInLoadingState={true}
				injectedJavaScript={patchPostMessageJsCode}
				allowUniversalAccessFromFileURLs={true}
				onMessage={(event) => handleMessage(event)}
				onNavigationStateChange={(event) => handleNavigation(event)}
				javaScriptEnabled={true}
			/>
		</View>
	);
}
export default PayPal;
