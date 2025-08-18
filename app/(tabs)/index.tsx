import { Image, StyleSheet, Platform } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
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
