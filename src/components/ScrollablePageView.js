import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import commonStyles from './../commonStyles';
import Loader from './Loader';
import {useStateValue} from '../store/store';
import Drawer from './../pages/Drawer';

function ScrollablePageView(props) {
	const [state] = useStateValue();
	const {scrollable = true, bottomBar, header, navigation, dispatch} = props;
	return (
		<View style={[commonStyles.pageStyle, styles.safeAreaView]}>
			{header}
			<View style={{flex: 1}}>
				{scrollable ? (
					<ScrollView style={[{flex: 1}, props.style]}>
						{props.children}
					</ScrollView>
				) : (
					props.children
				)}
			</View>
			{bottomBar}
			{state.loading && <Loader />}
			{state.drawer && <Drawer navigation={navigation} dispatch={dispatch} />}
		</View>
	);
}

const styles = StyleSheet.create({
	safeAreaView: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		position: 'relative',
	},
});

export default ScrollablePageView;
