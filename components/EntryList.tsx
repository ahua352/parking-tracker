import { View, Text, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ThemedText } from "./ThemedText";
import { FontAwesome } from "@expo/vector-icons";

enum EntryType {
	PARKING = "parking",
	WARDEN = "warden",
	FINE = "fine",
}

export function EntryList() {
	// TODO: Replace later
	const entries = [
		{
			id: 1,
			dateStart: new Date("2023-10-01T14:30:00"),
			dateEnd: new Date("2023-10-01T15:30:00"),
			location: "123 Random St, Some Place, Some City",
			geocode: [-36.84845, 174.762192],
			type: EntryType.PARKING,
			name: "Parking 123",
			notes: "Some description about the parking spot",
			files: [],
		},
		{
			id: 2,
			dateStart: new Date("2023-10-02T16:30:00"),
			dateEnd: new Date("2023-10-02T18:30:00"),
			location: "456 Random St, Some Place, Some City",
			geocode: [-36.867697, 174.7190158],
			type: EntryType.WARDEN,
			name: "",
			notes: "",
			files: [],
		},
		{
			id: 3,
			dateStart: new Date("2023-10-03T10:30:00"),
			dateEnd: new Date("2023-10-03T12:30:00"),
			location: "789 Random St, Some Place, Some City",
			geocode: [-36.8607564, 174.77781],
			type: EntryType.FINE,
			name: "",
			notes: "Museum",
			files: [],
		},
	];

	return (
		<ScrollView>
			<View>
				<View style={{ ...styles.iconCircle }}>
					<FontAwesome name="car" size={24} color="pink" />
				</View>
				<View style={{ ...styles.iconCircle }}>
					<FontAwesome name="shield" size={24} color="pink" />
				</View>
				<View style={{ ...styles.iconCircle }}>
					<FontAwesome name="money" size={24} color="pink" />
				</View>
				{entries.map((e, i) => (
					<View key={i}>
						<ThemedText>{e.type}</ThemedText>
					</View>
				))}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	iconCircle: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: "#f0f0f0",
		justifyContent: "center",
		alignItems: "center",
		margin: 5,
	},
});
