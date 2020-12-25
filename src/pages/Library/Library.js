import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Tab from '../../components/Tab';
import commonStyles from '../../commonStyles';
import ScrollablePageView from '../../components/ScrollablePageView';
import BottomBar from '../BottomBar';

const tabs = [{title: 'Listened'}, {title: 'Purchased'}, {title: 'Likes'}];

function Library(props) {
	const {navigation} = props;
	return (
		<ScrollablePageView bottomBar={<BottomBar navigation={navigation} />}>

			<View style={[commonStyles.compactPageStyle, styles.tabContainer]}>
				<Text>My Library (Work In Progress)</Text>
			</View>
		</ScrollablePageView>
	);
}

const styles = StyleSheet.create({
	tabContainer: {

	},
});

export default Library;
