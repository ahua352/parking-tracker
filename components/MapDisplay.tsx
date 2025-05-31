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
import { FontAwesome } from "@expo/vector-icons";

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
			color: colorScheme === "dark" ? "#bfc7d5" : "black",
			flex: 1,
		},
		inputContainer: {
			flexDirection: "row",
			alignItems: "center",
			borderWidth: 1,
			padding: 6,
			paddingVertical: 4,
			borderRadius: 8,
			backgroundColor: colorScheme === "dark" ? "#292d3e" : "white",
			borderColor: "black",
		},
		searchButton: {
			alignItems: "center",
			padding: 8,
			paddingHorizontal: 12,
		},
		// TODO: Remove later
		inputExample: {
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
			{/* <TextInput
				placeholder="Optional"
				style={styles.inputExample}
				placeholderTextColor="#72777f"
			/> */}

			<View style={styles.inputContainer}>
				<TextInput
					onChangeText={setAddress}
					value={address}
					placeholder="Enter location"
					style={styles.input}
					placeholderTextColor="#72777f"
				/>
				<Pressable onPress={onPress} style={styles.searchButton}>
					<FontAwesome
						name={"search"}
						size={20}
						color={colorScheme === "dark" ? "#bfc7d5" : "black"}
					/>
				</Pressable>
			</View>

			<View style={styles.mapContainer}>
				<View style={[styles.map, { backgroundColor: "lightgreen" }]}></View>
				{/* <MapView style={styles.map} /> */}
			</View>
		</View>
	);
}
