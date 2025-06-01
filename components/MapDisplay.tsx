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
import { useEffect, useRef, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import dummySuggestions from "../data/suggestions.json";
import { Coordinate, Suggestion } from "@/constants/MapConstants";
import { v4 as uuidv4 } from "uuid";
import { Palette } from "@/constants/Colors";

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
	const debounceTimer = useRef<NodeJS.Timeout | null>(null);
	const [sessionToken, setSessionToken] = useState<string>(uuidv4());

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
			sessionToken,
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
				"X-Goog-FieldMask":
					"suggestions.placePrediction.text.text,suggestions.placePrediction.placeId",
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
				"X-Goog-Session-Token": sessionToken,
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
			console.log("Session token before reset:", sessionToken);
			setSessionToken(uuidv4());
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

	const onChangeText = (text: string) => {
		setLocation(text);

		if (debounceTimer.current) {
			clearTimeout(debounceTimer.current);
		}

		debounceTimer.current = setTimeout(() => {
			if (text.length > 2) {
				onPressSearch();
			} else {
				setSuggestions([]);
			}
		}, 250);
	};

	const onPressClear = () => {
		setLocation("");
		setSuggestions([]);
		if (debounceTimer.current) {
			clearTimeout(debounceTimer.current);
		}
	};

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
			// backgroundColor: "lightgreen",
		},
		input: {
			color: colorScheme === "dark" ? Palette.greyLight3 : Palette.black,
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
			backgroundColor:
				colorScheme === "dark" ? Palette.blueNavy : Palette.white,
			borderColor: Palette.black,
		},
		searchButton: {
			alignItems: "center",
			padding: 8,
			paddingHorizontal: 12,
		},
		searchButtonPressed: {
			backgroundColor:
				colorScheme === "dark" ? Palette.greyDark : Palette.greyLight2,
			borderRadius: 8,
		},
		searchResults: {
			backgroundColor:
				colorScheme === "dark" ? Palette.blueNavy : Palette.white,
			zIndex: 10,
			borderBottomLeftRadius: 8,
			borderBottomRightRadius: 8,
			position: "absolute",
			top: -6,
			left: 0,
			right: 0,
			borderColor: Palette.black,
			borderWidth: 1,
		},
		searchResultItem: {
			padding: 8,
			borderBottomWidth: 1,
			borderBottomColor:
				colorScheme === "dark" ? Palette.greyDark2 : Palette.greyLight,
		},
		searchResultText: {
			fontSize: 14,
		},
		searchResultItemPressed: {
			backgroundColor:
				colorScheme === "dark" ? Palette.greyDark : Palette.greyLight2,
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
						onChangeText={onChangeText}
						value={location}
						placeholder="Enter location"
						style={styles.input}
						placeholderTextColor={Palette.grey}
					/>
					<Pressable
						onPress={onPressClear}
						style={({ pressed }: { pressed: boolean }) => [
							styles.searchButton,
							pressed && styles.searchButtonPressed,
						]}
					>
						<FontAwesome
							name={"close"}
							size={20}
							color={
								colorScheme === "dark" ? Palette.greyLight3 : Palette.black
							}
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
