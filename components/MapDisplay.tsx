import {
	FlatList,
	Pressable,
	StyleSheet,
	TextInput,
	useColorScheme,
	View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { ThemedText } from "./ThemedText";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import dummySuggestions from "../data/suggestions.json";
import { Coordinate, Suggestion } from "@/constants/MapConstants";

type MapDisplayProps = {
	location: string;
	setLocation: (location: string) => void;
	coordinates: Coordinate | null;
	setCoordinates: (coordinates: Coordinate) => void;
};

export function MapDisplay({
	location,
	setLocation,
	coordinates,
	setCoordinates,
}: MapDisplayProps) {
	const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
	const colorScheme = useColorScheme();
	const [userLocation, setUserLocation] = useState<Coordinate | null>(null);

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

		// setSuggestions(dummySuggestions);

		if (userLocation) {
			fetchAutocomplete(location, {
				lat: userLocation.latitude,
				lng: userLocation.longitude,
			}).then((suggestions) => {
				setSuggestions(suggestions);
				console.log(JSON.stringify(suggestions, null, 2));
			});
		} else {
			fetchAutocomplete(location).then((suggestions) => {
				setSuggestions(suggestions);
				console.log(JSON.stringify(suggestions, null, 2));
			});
		}
	};

	const fetchPlaceDetails = async (item: Suggestion) => {
		const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
		const url =
			"https://places.googleapis.com/v1/places/" + item.placePrediction.placeId;
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-Api-Key": apiKey,
				"X-Goog-FieldMask": "location",
			},
		});
		const data = await response.json();

		console.log("Place details:", data);

		return data;
	};

	const onPressItem = (item: Suggestion) => {
		console.log("Item pressed:", item);

		setLocation(item.placePrediction.text.text);
		setSuggestions([]);

		fetchPlaceDetails(item).then((details) => {
			if (details.location) {
				setCoordinates({
					latitude: details.location.latitude,
					longitude: details.location.longitude,
				});
			} else {
				console.log("No location found for the selected place.");
			}
		});
	};

	async function getUserLocation() {
		try {
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status === "granted") {
				const location = await Location.getCurrentPositionAsync({});
				console.log("User location:", location);
				const coordinates = {
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
				};
				setUserLocation(coordinates);
				return coordinates;
			} else {
				console.log("Location permission not granted");
				return null;
			}
		} catch (e) {
			console.log("Location error:", e);
			return null;
		}
	}

	useEffect(() => {
		getUserLocation();
	}, []);

	const styles = StyleSheet.create({
		container: { padding: 8, gap: 8, flex: 1 },
		mapContainer: {
			flex: 1,
		},
		map: {
			width: "100%",
			flex: 1,
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
		searchButtonPressed: {
			backgroundColor: colorScheme === "dark" ? "#535664" : "#a8a8a8",
			borderRadius: 8,
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
		searchResultItemPressed: {
			backgroundColor: colorScheme === "dark" ? "#535664" : "#a8a8a8",
		},
		autocompleteContainer: {
			position: "absolute",
			top: 24,
			left: 16,
			right: 16,
			zIndex: 10,
		},
	});
	return (
		<View style={styles.container}>
			<View style={styles.autocompleteContainer}>
				<View style={styles.inputContainer}>
					<TextInput
						onChangeText={setLocation}
						value={location}
						placeholder="Enter location"
						style={styles.input}
						placeholderTextColor="#72777f"
					/>
					<Pressable
						onPress={onPressSearch}
						style={({ pressed }: { pressed: boolean }) => [
							styles.searchButton,
							pressed && styles.searchButtonPressed,
						]}
					>
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
								style={({ pressed }: { pressed: boolean }) => [
									styles.searchResultItem,
									pressed && styles.searchResultItemPressed,
								]}
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
				<MapView
					style={styles.map}
					region={
						coordinates
							? {
									...coordinates,
									latitudeDelta: 0.01,
									longitudeDelta: 0.01,
							  }
							: userLocation
							? {
									...userLocation,
									latitudeDelta: 0.01,
									longitudeDelta: 0.01,
							  }
							: undefined
					}
				>
					{coordinates && <Marker coordinate={coordinates} />}
				</MapView>
			</View>
		</View>
	);
}
