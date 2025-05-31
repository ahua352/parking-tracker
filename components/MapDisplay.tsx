import {
	Pressable,
	StyleSheet,
	TextInput,
	useColorScheme,
	View,
} from "react-native";
import MapView from "react-native-maps";
import { ThemedText } from "./ThemedText";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { useState } from "react";

export function MapDisplay() {
	const [address, setAddress] = useState("");
	const colorScheme = useColorScheme();

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
		fetchAutocomplete(address, userLocation).then((suggestions) => {
			console.log(JSON.stringify(suggestions, null, 2));
		});
	};

	const styles = StyleSheet.create({
		mapContainer: {
			flex: 1,
		},
		map: {
			width: "100%",
			height: 300,
		},
		input: {
			borderWidth: 1,
			padding: 10,
			paddingVertical: 14,
			borderRadius: 8,
			backgroundColor: colorScheme === "dark" ? "#292d3e" : "white",
			borderColor: "black",
			color: colorScheme === "dark" ? "#bfc7d5" : "black",
		},
	});
	return (
		<View style={{ backgroundColor: "pink", padding: 8, gap: 8 }}>
			<TextInput
				onChangeText={setAddress}
				value={address}
				placeholder="Enter location"
				style={styles.input}
				placeholderTextColor="#72777f"
			/>
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
