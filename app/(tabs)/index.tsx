import { Image, StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { EntryList } from "@/components/EntryList";
import { Palette } from "@/constants/Colors";

export default function HomeScreen() {
	return (
		<ParallaxScrollView
			headerBackgroundColor={{
				light: Palette.blueLight2,
				dark: Palette.blueDark2,
			}}
			headerImage={
				<Image
					source={require("@/assets/images/car-header.png")}
					style={styles.headerImage}
				/>
			}
		>
			<EntryList />
		</ParallaxScrollView>
	);
}

const styles = StyleSheet.create({
	headerImage: {
		width: "100%",
		height: "100%",
	},
});
