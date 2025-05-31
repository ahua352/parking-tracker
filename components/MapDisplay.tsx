import { Pressable, StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import { ThemedText } from "./ThemedText";
import Constants from "expo-constants";
import * as Location from "expo-location";

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
	// Fetch autocomplete suggestions from Google Places API
	const fetchAutocomplete = async (
		input: string,
		location?: { lat: number; lng: number }
	) => {
		const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
		const url = "https://places.googleapis.com/v1/places:autocomplete";
		const body: any = {
			input,
			languageCode: "en",
		};
		if (location) {
			body.locationBias = {
				circle: {
					center: {
						latitude: location.lat,
						longitude: location.lng,
					},
					radius: 5000, // 5 km radius
				},
			};
		}
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-Api-Key": apiKey,
			},
			body: JSON.stringify(body),
		});
		const data = await response.json();
		return data.suggestions;
	};

	const onPress = async () => {
		console.log("Search button pressed");

		let userLocation = undefined;
		try {
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status === "granted") {
				const location = await Location.getCurrentPositionAsync({});
				userLocation = {
					lat: location.coords.latitude,
					lng: location.coords.longitude,
				};
			}
		} catch (e) {
			console.log("Location error:", e);
		}
		fetchAutocomplete("1 Astley", userLocation).then((suggestions) => {
			console.log(JSON.stringify(suggestions, null, 2));
		});
	};
	return (
		<View style={{ backgroundColor: "pink", padding: 8, gap: 8 }}>
			<View>
				<Pressable
					onPress={onPress}
					style={{
						backgroundColor: "#2196f3",
						borderRadius: 12,
						paddingVertical: 12,
						alignItems: "center",
					}}
				>
					<ThemedText style={{ color: "white", fontWeight: "bold" }}>
						Search
					</ThemedText>
				</Pressable>
			</View>

			<View style={styles.mapContainer}>
				<MapView style={styles.map} />
			</View>
		</View>
	);
}
