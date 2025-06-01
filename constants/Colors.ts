/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const Palette = {
	black: "#151718",
	black2: "#11181c",
	blue: "#2196f3",
	blue2: "#0a7ea4",
	blueDark: "#135a91",
	blueDark2: "#1d3d47",
	blueLight: "#79c0f7",
	blueLight2: "#a1cedc",
	blueNavy: "#292d3e",
	greyDark: "#535664",
	greyDark2: "#444",
	grey: "#72777f",
	grey2: "#687076",
	greyLight: "lightgrey",
	greyLight2: "#a8a8a8",
	greyLight3: "#bfc7d5",
	greyLight4: "#ecedee",
	greyLight5: "#9ba1a6",
	red: "#f44336",
	white: "white",
};

const tintColorLight = Palette.blue2;
const tintColorDark = Palette.white;

export const Colors = {
	light: {
		text: Palette.black2,
		background: Palette.white,
		tint: tintColorLight,
		icon: Palette.grey2,
		tabIconDefault: Palette.grey2,
		tabIconSelected: tintColorLight,
	},
	dark: {
		text: Palette.greyLight4,
		background: Palette.black,
		tint: tintColorDark,
		icon: Palette.greyLight5,
		tabIconDefault: Palette.greyLight5,
		tabIconSelected: tintColorDark,
	},
};
