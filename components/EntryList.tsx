import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { ThemedText } from "./ThemedText";
import { FontAwesome } from "@expo/vector-icons";
import { iconMap } from "@/constants/EntryConstants";
import { useEntryContext } from "@/contexts/EntryContext";
import { useRouter } from "expo-router";

export function EntryList() {
	const { entries } = useEntryContext();
	const router = useRouter();

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
						<Pressable
							key={i}
							style={({ pressed }: { pressed: boolean }) => [
								styles.row,
								pressed && styles.rowPressed,
							]}
							onPress={() => {
								console.log(`Entry ${e.id} pressed`);
								router.push({
									pathname: "/editEntry",
									params: { id: e.id.toString() },
								});
							}}
						>
							<View style={styles.leftSection}>
								<View style={styles.iconCircle}>
									<FontAwesome name={iconMap[e.type]} size={24} color="pink" />
								</View>
								<View style={styles.textContainer}>
									<ThemedText type="subtitle">{e.type}</ThemedText>
									<ThemedText style={styles.dateStart}>
										{e.dateStart.toLocaleString()}
									</ThemedText>
									<View style={styles.locationContainer}>
										<ThemedText>{e.location}</ThemedText>
									</View>
								</View>
							</View>
							<View style={styles.duration}>
								<ThemedText>
									{minutes === 0 ? `${hours} h` : `${hours} h ${minutes} m`}
								</ThemedText>
							</View>
						</Pressable>
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
		margin: 8,
	},
	row: {
		flexDirection: "row",
		backgroundColor: "slategrey",
		justifyContent: "space-between",
		marginBottom: 16,
		padding: 8,
		borderRadius: 8,
	},
	rowPressed: {
		backgroundColor: "darkslategrey",
	},
	leftSection: {
		flexDirection: "row",
		flex: 1,
	},
	textContainer: {
		marginLeft: 8,
		flexWrap: "wrap",
		flex: 1,
	},
	duration: {
		marginRight: 8,
		flexShrink: 0,
	},
	dateStart: {
		marginTop: 4,
	},
	locationContainer: {
		flex: 1,
	},
});
