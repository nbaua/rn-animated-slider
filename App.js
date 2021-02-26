import React from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg"; //RadialGradient
import { default as products } from "./data/products";
const { width, height } = Dimensions.get("window");

const __DEFAULT_FONT_SIZE__ = 14;
const __DEFAULT_PADDING__ = 15;
const __DEFAULT_MARGIN__ = 15;

const __DEFAULT_OUTPUT_ROTATION__ = "0deg";
const __ANGLED_OUTPUT_ROTATION__ = "40deg";
const __MAXIMUM_OUTPUT_ROTATION__ = "360deg";
const __DEFAULT_SHADE_OF_BLACK = "rgba(0,0,0,0.75)"; //Shadows the backgrounds and header text
const __DEFAULT_SHADE_OF_WHITE = "rgba(255,255,255,0.9)"; //Highlights the text
const __DEFAULT_RECT_SCALE_RATIO__ = 1.5;
const __DEFAULT_IMAGE_RESIZE_RATIO__ = 0.85; // Adjusts the image preview
const __DEFAULT_INPUT_ROTATION__ = 250;
const __MAXIMUM_INPUT_ROTATION__ = 450;

const __DYNAMIC_COLOR_RANGE__ = ["#ff9100", "#ff1744", "#d500f9", "#3d5afe", "#00b0ff", "#1de9b6", "#76ff03"];

export default class App extends React.Component {
	constructor() {
		super();
		this.state = {
			rotationAnimationValue: new Animated.Value(__DEFAULT_INPUT_ROTATION__),
		};
	}

	_xAxisScroll = new Animated.Value(0);
	_yAxisScroll = new Animated.Value(0);

	render() {
		return (
			<View style={styles.container}>
				<Animated.ScrollView pagingEnabled horizontal onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: this._xAxisScroll } } }], { useNativeDriver: true })} contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}>
					{products.map((item, i) => this.renderProductItem(item, i))}
				</Animated.ScrollView>
			</View>
		);
	}

	renderProductItem = (item, i) => {
		const __DEFAULT_INPUT_RANGE__ = [(i - 2) * width, (i - 1) * width, i * width, (i + 1) * width, (i + 2) * width];
		const __DEFAULT_OUTPUT_RANGE__ = [1, 0.5, 1, 0.5, 1];
		const __ZOOMING_OUTPUT_RANGE__ = [1, 2, 1, 2, 1];

		const imageScale = this._xAxisScroll.interpolate({
			inputRange: __DEFAULT_INPUT_RANGE__,
			outputRange: __DEFAULT_OUTPUT_RANGE__,
		});

		const textScale = this._xAxisScroll.interpolate({
			inputRange: __DEFAULT_INPUT_RANGE__,
			outputRange: __ZOOMING_OUTPUT_RANGE__,
		});

		const imageOpacity = this._xAxisScroll.interpolate({
			inputRange: __DEFAULT_INPUT_RANGE__,
			outputRange: __DEFAULT_OUTPUT_RANGE__,
		});

		const textOpacity = this._xAxisScroll.interpolate({
			inputRange: __DEFAULT_INPUT_RANGE__,
			outputRange: __ZOOMING_OUTPUT_RANGE__,
		});

		let rotateAnimation = this.state.rotationAnimationValue.interpolate({
			inputRange: [__DEFAULT_INPUT_ROTATION__, __MAXIMUM_INPUT_ROTATION__],
			outputRange: [__DEFAULT_OUTPUT_ROTATION__, __MAXIMUM_OUTPUT_ROTATION__],
		});

		return (
			<View key={item.id} style={[styles.container, styles.productContainer]}>
				<Animated.Image
					source={{ uri: item.image }}
					style={[
						styles.imagePreview,
						{
							transform: [
								{
									scale: imageScale,
								},
								{ rotate: rotateAnimation },
							],
							opacity: imageOpacity,
						},
					]}
				/>
				<Animated.View
					style={[
						styles.detailsContainer,
						{
							transform: [
								{
									scale: imageScale,
								},
							],
							opacity: imageOpacity,
						},
					]}
				>
					<Animated.Text
						style={[
							styles.defaultFont,
							styles.titleText,
							{
								opacity: textOpacity,
							},
						]}
					>
						{item.title}
					</Animated.Text>
					<Animated.Text style={[styles.defaultFont, styles.subtitleText]}>{item.subtitle}</Animated.Text>
					<Animated.Text style={[styles.defaultFont, styles.descriptionText]}>{item.description}</Animated.Text>
					<Animated.Text
						style={[
							styles.defaultFont,
							styles.priceText,
							{
								transform: [
									{
										scale: textScale,
									},
								],
							},
						]}
					>
						{item.price}
					</Animated.Text>
				</Animated.View>
				{this.renderGradientBackground(__DYNAMIC_COLOR_RANGE__[i], __DYNAMIC_COLOR_RANGE__[i + 1], __DEFAULT_INPUT_RANGE__)}
			</View>
		);
	};

	renderGradientBackground = (startColor, stopColor, inputRange) => {
		const rotate = this._xAxisScroll.interpolate({
			inputRange,
			outputRange: [__ANGLED_OUTPUT_ROTATION__, __DEFAULT_OUTPUT_ROTATION__, __ANGLED_OUTPUT_ROTATION__, __DEFAULT_OUTPUT_ROTATION__, __ANGLED_OUTPUT_ROTATION__],
		});
		const translateX = this._xAxisScroll.interpolate({
			inputRange,
			outputRange: [0, width, 0, -width, 0],
		});
		const opacity = this._xAxisScroll.interpolate({
			inputRange,
			outputRange: [1, 0, 1, 0, 1],
		});

		return (
			<Animated.View
				style={[
					styles.animationWrapper,
					{
						transform: [
							{
								rotate,
							},
							{
								translateX,
							},
							{
								scale: __DEFAULT_RECT_SCALE_RATIO__, //This has to be fixed value
							},
						],
						opacity,
					},
				]}
			>
				<Svg height={height} width={width}>
					<Defs>
						<LinearGradient id="gradientColor" x1="0%" y1="100%" x2="100%" y2="0%">
							<Stop offset="35%" stopColor={startColor} stopOpacity="1" />
							<Stop offset="65%" stopColor={stopColor} stopOpacity="1" />
						</LinearGradient>
					</Defs>
					<Rect x="0" y="0" width={width} height={height} fill={`url(#gradientColor)`} />
				</Svg>
			</Animated.View>
		);
	};
}

const styles = StyleSheet.create({
	defaultFont: {
		color: __DEFAULT_SHADE_OF_BLACK,
	},
	container: {
		flex: 1,
		backgroundColor: __DEFAULT_SHADE_OF_BLACK,
		alignItems: "center",
		justifyContent: "center",
	},
	animationWrapper: {
		position: "absolute",
		top: 0,
		left: 0,
		zIndex: -1,
	},

	productContainer: {
		width,
		height: height + 60,
		alignItems: "center",
		justifyContent: "flex-end",
		// marginBottom: 60,
	},
	detailsContainer: {
		alignItems: "center",
		padding: 5,
	},
	imagePreview: {
		width: width * __DEFAULT_IMAGE_RESIZE_RATIO__,
		height: width * __DEFAULT_IMAGE_RESIZE_RATIO__,
		resizeMode: "contain",
	},
	titleText: {
		fontSize: __DEFAULT_FONT_SIZE__ * 3,
		fontWeight: "bold",
	},
	subtitleText: {
		fontSize: __DEFAULT_FONT_SIZE__,
		textAlignVertical: "center",
		textAlign: "center",
		fontWeight: "bold",
		color: __DEFAULT_SHADE_OF_WHITE,
		padding: __DEFAULT_PADDING__,
		width: width - width / 6,
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
		borderBottomLeftRadius: __DEFAULT_FONT_SIZE__ * 2, // using font-size as basis
		borderBottomRightRadius: __DEFAULT_FONT_SIZE__ * 2, // using font-size as basis
		backgroundColor: __DEFAULT_SHADE_OF_BLACK,
	},
	descriptionText: {
		width: width - width / 4,
		fontSize: __DEFAULT_FONT_SIZE__ * 1.25,
		marginTop: __DEFAULT_MARGIN__,
		marginBottom: __DEFAULT_MARGIN__,
		textAlign: "center",
	},
	priceText: {
		color: __DEFAULT_SHADE_OF_WHITE,
		fontSize: __DEFAULT_FONT_SIZE__ * 2,
		fontWeight: "bold",
		backgroundColor: __DEFAULT_SHADE_OF_BLACK,
		height: width / 4,
		width: width / 4,
		padding: __DEFAULT_PADDING__,
		borderRadius: width / 4,
		textAlign: "center",
		textAlignVertical: "center",
	},
});
