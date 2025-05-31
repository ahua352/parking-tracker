import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";

const styles = StyleSheet.create({
	mapContainer: {
		flex: 1,
	},
	map: {
		width: "100%",
		height: 300,
	},
	inputContainer: {
		width: "100%", // Ensure full width
		paddingHorizontal: 16,
	},
	input: {
		height: 40, // Comfortable touch target
	},
});

export function MapDisplay() {
	const handlePlaceSelect = (place: any) => {
		console.log("Selected place:", place);
	};
	return (
		<View style={{ backgroundColor: "pink", padding: 8 }}>
			{/* Access key: Constants.expoConfig?.extra?.googleMapsApiKey */}

			<View style={styles.mapContainer}>
				<MapView style={styles.map} />
			</View>
		</View>
	);
}
