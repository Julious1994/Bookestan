import React from 'react';
import {
	View,
	ScrollView,
	Image,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import Typography from './Typography';

function HorizontalList(props) {
	const {data, title, type} = props;
	const getUri = (item, i) => {
		return {uri: `${item.CoverImagePath}`};
	};
	if (data.length <= 0) {
		return null;
	}
	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<Typography variant="title2" style={[styles.title]}>
					{title}
				</Typography>
				{/* <TouchableOpacity style={styles.seeMore}>
					<Typography variant="body" style={styles.seeMoreText}>
						See all
					</Typography>
					<Image
						source={imageMapper.moreArrow.source}
						style={styles.moreArrow}
					/>
				</TouchableOpacity> */}
			</View>
			<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
				{data.map((item, i) => (
					<View key={i} style={styles.bookViewContainer}>
						<TouchableOpacity
							key={i}
							style={styles.item}
							onPress={() => props.onPress(item, i)}>
							<Image
								source={getUri(item, i)}
								resizeMode={type === 'historic' ? 'cover' : 'cover'}
								style={[
									type === 'historic' ? styles.historicImage : styles.image,
								]}
							/>
						</TouchableOpacity>
						<Typography variant="title3" style={styles.bookName} lines={1}>
							{item.Title}
						</Typography>
						<Typography variant="body" style={styles.duration}>
							{`$ ${item.Price}`}
						</Typography>
					</View>
				))}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 20,
	},
	item: {
		marginRight: 12,
		position: 'relative',
		maxWidth: 120,
		elevation: 5,
		borderRadius: 10,
		shadowRadius: 5,
	},
	image: {
		borderRadius: 5,
		width: 120,
		height: 180,
	},
	headerContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginRight: 36,
	},
	title: {
		marginBottom: 10,
		fontWeight: '600',
	},
	seeMore: {
		display: 'flex',
		flexDirection: 'row',
	},
	seeMoreText: {
		fontWeight: 'normal',
		color: '#66837B',
	},
	moreArrow: {
		marginTop: 6,
		marginLeft: 6,
		width: 5,
		height: 8,
	},
	bookName: {
		marginTop: 5,
		fontWeight: '100',
		color: '#66837B',
	},
	duration: {
		color: '#003124',
	},
	historicImage: {
		width: 120,
		height: 80,
	},
	playButtonView: {
		position: 'absolute',
		alignSelf: 'center',
		marginTop: 24,
	},
	playStyle: {
		width: 32,
		height: 32,
	},
	bookViewContainer: {
		// display: 'flex'
		width: 120,
		marginRight: 20,
		// marginLeft: 10,
		marginBottom: 5,
	},
});

export default HorizontalList;
