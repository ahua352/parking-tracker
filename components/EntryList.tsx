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

	// Map entry types to icons
	const iconMap: Record<EntryType, "car" | "shield" | "money"> = {
		[EntryType.PARKING]: "car",
		[EntryType.WARDEN]: "shield",
		[EntryType.FINE]: "money",
	};

	return (
		<ScrollView>
			<View>
				{entries.map((e, i) => {
					// Duration in minutes
					const duration = Math.round(
						(e.dateEnd.getTime() - e.dateStart.getTime()) / (1000 * 60)
					);
					const hours = Math.floor(duration / 60);
					const minutes = duration % 60;

					return (
						<View key={i} style={styles.row}>
							<View style={styles.iconCircle}>
								<FontAwesome name={iconMap[e.type]} size={24} color="pink" />
							</View>
							<View>
								<ThemedText>{e.type}</ThemedText>
								<ThemedText>{e.dateStart.toLocaleString()}</ThemedText>
								{/* Remove later */}
								<ThemedText>{e.dateEnd.toLocaleString()}</ThemedText>
								<ThemedText>{e.location}</ThemedText>
							</View>
							<View>
								<ThemedText>
									{minutes === 0 ? `${hours} h` : `${hours} h ${minutes} m`}
								</ThemedText>
							</View>
						</View>
					);
				})}
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
	row: {
		flexDirection: "row",
	},
});
