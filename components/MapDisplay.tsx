import {
	FlatList,
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
import dummySuggestions from "../data/suggestions.json";

export function MapDisplay() {
	const [address, setAddress] = useState("");
	type Suggestion = {
		placePrediction: {
			place: string;
			placeId: string;
			text: {
				text: string;
				matches?: {
					endOffset: number;
				}[];
			};
			structuredFormat?: {
				mainText: {
					text: string;
					matches?: {
						endOffset: number;
					}[];
				};
				secondaryText: {
					text: string;
				};
			};
			types?: string[];
		};
	};
	const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
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

	const onPressSearch = async () => {
		console.log("Search button pressed");

		setSuggestions(dummySuggestions);

		// let userLocation = undefined;
		// try {
		// 	const { status } = await Location.requestForegroundPermissionsAsync();
		// 	if (status === "granted") {
		// 		const location = await Location.getCurrentPositionAsync({});
		// 		userLocation = {
		// 			lat: location.coords.latitude,
		// 			lng: location.coords.longitude,
		// 		};
		// 	}
		// } catch (e) {
		// 	console.log("Location error:", e);
		// }
		// fetchAutocomplete(address, userLocation).then((suggestions) => {
		// 	setSuggestions(suggestions);
		// 	console.log(JSON.stringify(suggestions, null, 2));
		// });
	};

	const onPressItem = (item: Suggestion) => {
		console.log("Item pressed:", item);
		setAddress(item.placePrediction.text.text);
		setSuggestions([]);
	};

	const styles = StyleSheet.create({
		container: { backgroundColor: "pink", padding: 8, gap: 8 },
		mapContainer: {
			flex: 1,
		},
		map: {
			width: "100%",
			height: 300,
			backgroundColor: "lightgreen",
		},
		input: {
			color: colorScheme === "dark" ? "#bfc7d5" : "black",
			flex: 1,
		},
		inputContainer: {
			height: 52,
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
		searchResults: {
			backgroundColor: colorScheme === "dark" ? "#292d3e" : "white",
			zIndex: 10,
			borderBottomLeftRadius: 8,
			borderBottomRightRadius: 8,
			position: "absolute",
			top: -6,
			left: 0,
			right: 0,
		},
		searchResultItem: {
			padding: 8,
			borderBottomWidth: 1,
			borderBottomColor: colorScheme === "dark" ? "#444" : "#ccc",
		},
		searchResultText: {
			fontSize: 14,
		},
	});
	return (
		<View style={styles.container}>
			{/* <TextInput
				placeholder="Optional"
				style={styles.inputExample}
				placeholderTextColor="#72777f"
			/> */}

			<View>
				<View style={styles.inputContainer}>
					<TextInput
						onChangeText={setAddress}
						value={address}
						placeholder="Enter location"
						style={styles.input}
						placeholderTextColor="#72777f"
					/>
					<Pressable onPress={onPressSearch} style={styles.searchButton}>
						<FontAwesome
							name={"search"}
							size={20}
							color={colorScheme === "dark" ? "#bfc7d5" : "black"}
						/>
					</Pressable>
				</View>

				<View style={{ position: "relative" }}>
					<FlatList
						style={styles.searchResults}
						data={suggestions}
						keyExtractor={(_, idx) => idx.toString()}
						renderItem={({ item }) => (
							<Pressable
								onPress={() => onPressItem(item)}
								style={styles.searchResultItem}
							>
								<ThemedText style={styles.searchResultText}>
									{item.placePrediction.text.text}
								</ThemedText>
							</Pressable>
						)}
					/>
				</View>
			</View>

			<View style={styles.mapContainer}>
				<View style={styles.map}></View>
				{/* <MapView style={styles.map} /> */}
			</View>
		</View>
	);
}
