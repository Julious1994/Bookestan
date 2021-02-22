import React from 'react';
import HomeScreen from './pages/Home/Home';
import LoginScreen from './pages/Login';
import SignupScreen from './pages/Signup';
import BookProfile from './pages/Profile/BookProfile';
import SettingScreen from './pages/Profile/Setting';
import LibraryScreen from './pages/Library/Library';
import ForgotPassword from './pages/ForgotPassword';
import BookView from './pages/Book/BookView';
import EditProfile from './pages/Profile/EditProfile';
import ChangePassword from './pages/Profile/ChangePassoword';
import Cart from './pages/Checkout/Cart';
import PaymentForm from './pages/Checkout/Payment';
import PaypalPayment from './pages/Checkout/Paypal';
import BookPlayer from './pages/Book/BookPlayer';
import BookAudioList from './pages/Book/BookAudioList';
import Subscribe from "./pages/Checkout/Subscription/Subscribe";

const routes = (Stack) => (
	<Stack.Navigator screenOptions={{headerShown: false}}>
		<Stack.Screen name="Login" component={LoginScreen} key="login" />
		<Stack.Screen name="Subscribe" component={Subscribe} key="subscribe" />

		<Stack.Screen name="PaypalPayment" component={PaypalPayment} key="paypal" />
		<Stack.Screen name="Home" component={HomeScreen} />
		<Stack.Screen name="Signup" component={SignupScreen} key="signup" />
		<Stack.Screen
			name="ForgotPassword"
			component={ForgotPassword}
			key="forgotPassword"
		/>
		<Stack.Screen
			name="BookProfile"
			component={BookProfile}
			key="bookProfile"
		/>
		<Stack.Screen
			name="SettingScreen"
			component={SettingScreen}
			key="settingScreen"
		/>
		<Stack.Screen
			name="EditProfile"
			component={EditProfile}
			key="editProfile"
		/>
		<Stack.Screen
			name="ChangePassword"
			component={ChangePassword}
			key="changePassword"
		/>
		<Stack.Screen name="Library" component={LibraryScreen} key="library" />
		<Stack.Screen name="BookView" component={BookView} key="bookView" />
		<Stack.Screen name="Cart" component={Cart} key="cartView" />
		<Stack.Screen
			name="PaymentForm"
			component={PaymentForm}
			key="paymentFormView"
		/>
		<Stack.Screen name="BookPlayer" component={BookPlayer} key="bookPlayer" />
		<Stack.Screen
			name="BookAudioList"
			component={BookAudioList}
			key="bookAudioList"
		/>
	</Stack.Navigator>
);

export default routes;
