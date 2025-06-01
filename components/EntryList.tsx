import {
	View,
	StyleSheet,
	Pressable,
	ScrollView,
	useColorScheme,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { FontAwesome } from "@expo/vector-icons";
import { EntryType, iconMap } from "@/constants/EntryConstants";
import { useEntryContext } from "@/contexts/EntryContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Palette } from "@/constants/Colors";

export function EntryList() {
	const { entries } = useEntryContext();
	const router = useRouter();
	const colorScheme = useColorScheme();

	const styles = StyleSheet.create({
		iconCircle: {
			width: 50,
			height: 50,
			borderRadius: 25,
			backgroundColor: colorScheme === "dark" ? Palette.black : Palette.white,
			justifyContent: "center",
			alignItems: "center",
			margin: 8,
		},
		row: {
			flexDirection: "row",
			backgroundColor:
				colorScheme === "dark" ? Palette.blueNavy : Palette.greyLight,
			justifyContent: "space-between",
			marginBottom: 16,
			padding: 8,
			borderRadius: 8,
		},
		rowPressed: {
			backgroundColor:
				colorScheme === "dark" ? Palette.greyDark : Palette.greyLight2,
		},
		textType: {
			flex: 1,
		},
		duration: {
			marginRight: 8,
			flexShrink: 0,
		},
		dateStart: {
			marginTop: 6,
			fontStyle: "italic",
		},
		locationContainer: {
			flex: 1,
		},
		rightSection: { flexDirection: "column", flex: 1, marginLeft: 8 },
		topTextContainer: { flexDirection: "row", flex: 1 },
		filterContainer: {
			flexDirection: "row",
			gap: 10,
			marginBottom: 16,
		},
		filterHeading: { marginBottom: 4 },
		filterPressable: {
			flex: 1,
		},
		filterButton: {
			padding: 12,
			borderRadius: 24,
			alignItems: "center",
		},
		filterText: {
			fontWeight: "bold",
		},
		mapContainer: {
			flex: 1,
		},
		map: {
			width: "100%",
			height: 300,
		},
	});

	const [selectedFilter, setSelectedFilter] = useState<EntryType | null>(null);

	const FilterButton = ({ type }: { type: EntryType }) => {
		return (
			<Pressable
				style={styles.filterPressable}
				onPress={() => setSelectedFilter(selectedFilter === type ? null : type)}
			>
				<View
					style={[
						styles.filterButton,
						{
							backgroundColor:
								selectedFilter === type
									? Palette.blue
									: colorScheme === "dark"
									? Palette.blueDark
									: Palette.blueLight,
						},
					]}
				>
					<ThemedText style={styles.filterText}>{type}</ThemedText>
				</View>
			</Pressable>
		);
	};

	return (
		<ScrollView>
			<View>
				{entries.length === 0 ? (
					<ThemedText style={{ marginTop: 16 }}>No entries found.</ThemedText>
				) : (
					<>
						<ThemedText style={styles.filterHeading}>Filter by:</ThemedText>
						<View style={styles.filterContainer}>
							<FilterButton type={EntryType.PARKING} />
							<FilterButton type={EntryType.WARDEN} />
							<FilterButton type={EntryType.FINE} />
						</View>
						{entries
							.filter((e) => {
								if (selectedFilter === null) {
									return true;
								} else {
									return e.type === selectedFilter;
								}
							})
							.map((e, i) => {
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
										<View style={styles.iconCircle}>
											<FontAwesome
												name={iconMap[e.type]}
												size={24}
												color={
													colorScheme === "dark" ? Palette.white : Palette.black
												}
											/>
										</View>
										<View style={styles.rightSection}>
											<View style={styles.topTextContainer}>
												<ThemedText type="subtitle" style={styles.textType}>
													{e.type}
												</ThemedText>
												<ThemedText style={styles.duration}>
													{minutes === 0
														? `${hours} h`
														: `${hours} h ${minutes} m`}
												</ThemedText>
											</View>
											<View>
												<ThemedText style={styles.dateStart}>
													{e.dateStart.toLocaleString()}
												</ThemedText>
												<ThemedText>{e.location}</ThemedText>
											</View>
										</View>
									</Pressable>
								);
							})}
					</>
				)}
			</View>
		</ScrollView>
	);
}
