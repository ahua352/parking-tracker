import {
	View,
	StyleSheet,
	Pressable,
	ScrollView,
	useColorScheme,
	TextInput,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { FontAwesome } from "@expo/vector-icons";
import { EntryType, iconMap } from "@/constants/EntryConstants";
import { useEntryContext } from "@/contexts/EntryContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Palette } from "@/constants/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";

export function EntryList() {
	const { entries } = useEntryContext();
	const router = useRouter();
	const colorScheme = useColorScheme();
	const [isEditStartDate, setIsEditStartDate] = useState(true);
	const [startDate, setStartDate] = useState<Date | undefined>(undefined);
	const [endDate, setEndDate] = useState<Date | undefined>(undefined);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [search, setSearch] = useState("");

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
			alignItems: "center",
			justifyContent: "space-between",
		},
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
		dateFilterButton: {
			paddingHorizontal: 16,
			padding: 4,
			borderRadius: 24,
			alignItems: "center",
			flexDirection: "row",
			backgroundColor:
				colorScheme === "dark" ? Palette.blueDark : Palette.blueLight,
			gap: 6,
		},
		dateFilterText: {
			width: 98,
			fontWeight: "bold",
			color: colorScheme === "dark" ? Palette.white : Palette.black,
		},
		input: {
			// borderWidth: 1,
			padding: 10,
			// paddingVertical: 14,
			borderRadius: 8,
			backgroundColor:
				colorScheme === "dark" ? Palette.blueNavy : Palette.white,
			// borderColor: Palette.black,
			color: colorScheme === "dark" ? Palette.greyLight3 : Palette.black,
			flex: 1,
		},
		inputContainer: {
			marginBottom: 16,
			// height: 52,
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
		clearSearchButton: {
			alignItems: "center",
			padding: 8,
			paddingHorizontal: 12,
		},
		clearSearchButtonPressed: {
			backgroundColor:
				colorScheme === "dark" ? Palette.greyDark : Palette.greyLight2,
			borderRadius: 8,
		},
		clearDateButton: {
			alignItems: "center",
			paddingHorizontal: 4,
		},
		entriesFoundContainer: {
			marginVertical: 16,
			alignItems: "center",
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

	const onChangeDate = (event: any, selectedDate?: Date) => {
		// Update selected date
		if (event.type === "set" && selectedDate) {
			if (isEditStartDate) {
				const correctedStartDate = new Date(
					selectedDate.getFullYear(),
					selectedDate.getMonth(),
					selectedDate.getDate(),
					0,
					0,
					0,
					0
				);

				setStartDate(correctedStartDate);
			} else {
				const correctedEndDate = new Date(
					selectedDate.getFullYear(),
					selectedDate.getMonth(),
					selectedDate.getDate(),
					23,
					59,
					59,
					999
				);

				setEndDate(correctedEndDate);
			}
			setShowDatePicker(false);
			// Close date picker
		} else {
			setShowDatePicker(false);
		}
	};

	const DateFilterButton = ({ isStartDate }: { isStartDate: boolean }) => {
		return (
			<View>
				<Pressable
					onPress={() => {
						setIsEditStartDate(isStartDate);
						setShowDatePicker(true);
					}}
					style={styles.filterPressable}
				>
					<View
						style={[
							styles.dateFilterButton,
							{
								backgroundColor:
									isStartDate && startDate
										? Palette.blue
										: !isStartDate && endDate
										? Palette.blue
										: colorScheme === "dark"
										? Palette.blueDark
										: Palette.blueLight,
							},
						]}
					>
						{/* Not enough space to show calendar icon */}
						{/* <View>
								<FontAwesome
									name={"calendar"}
									size={24}
									color={colorScheme === "dark" ? Palette.white : Palette.black}
								/>
							</View> */}
						<TextInput
							value={
								isStartDate
									? startDate
										? startDate.toLocaleDateString()
										: "DD/MM/YYYY"
									: endDate
									? endDate.toLocaleDateString()
									: "DD/MM/YYYY"
							}
							editable={false}
							style={styles.dateFilterText}
						/>
						<Pressable
							onPress={() =>
								isStartDate ? setStartDate(undefined) : setEndDate(undefined)
							}
							style={({ pressed }: { pressed: boolean }) => [
								styles.clearDateButton,
								pressed && styles.clearSearchButtonPressed,
							]}
						>
							<View>
								<FontAwesome
									name={"close"}
									size={20}
									color={colorScheme === "dark" ? Palette.white : Palette.black}
								/>
							</View>
						</Pressable>
					</View>
				</Pressable>
			</View>
		);
	};

	const onPressClear = () => {
		setSearch("");
	};

	const getDurationString = (hours: number, minutes: number) => {
		if (hours === 0 && minutes === 0) {
			return "";
		} else if (hours === 0) {
			return `${minutes} m`;
		} else if (minutes === 0) {
			return `${hours} h`;
		} else {
			return `${hours} h ${minutes} m`;
		}
	};

	return (
		<ScrollView>
			<View style={styles.inputContainer}>
				<TextInput
					onChangeText={setSearch}
					value={search}
					placeholder="Search entries..."
					style={styles.input}
					placeholderTextColor={Palette.grey}
				/>
				<Pressable
					onPress={onPressClear}
					style={({ pressed }: { pressed: boolean }) => [
						styles.clearSearchButton,
						pressed && styles.clearSearchButtonPressed,
					]}
				>
					<FontAwesome
						name={"close"}
						size={20}
						color={colorScheme === "dark" ? Palette.greyLight3 : Palette.black}
					/>
				</Pressable>
			</View>

			<View style={styles.filterContainer}>
				<FilterButton type={EntryType.PARKING} />
				<FilterButton type={EntryType.WARDEN} />
				<FilterButton type={EntryType.FINE} />
			</View>
			<View style={[styles.filterContainer, { gap: 0 }]}>
				<DateFilterButton isStartDate={true} />
				<FontAwesome
					name={"arrow-right"}
					size={16}
					color={colorScheme === "dark" ? Palette.white : Palette.black}
				/>
				<DateFilterButton isStartDate={false} />
			</View>
			{showDatePicker && (
				<DateTimePicker
					value={
						isEditStartDate ? startDate ?? new Date() : endDate ?? new Date()
					}
					mode="date"
					onChange={onChangeDate}
					minimumDate={isEditStartDate ? undefined : startDate}
					maximumDate={
						isEditStartDate ? (endDate ? endDate : new Date()) : new Date()
					}
				/>
			)}

			<View style={styles.entriesFoundContainer}>
				<ThemedText type="subtitle">{entries.length} entries found</ThemedText>
			</View>

			{entries
				.filter((e) => {
					if (selectedFilter === null) {
						return true;
					} else {
						return e.type === selectedFilter;
					}
				})
				.filter((e) => {
					if (startDate && endDate) {
						return e.dateStart >= startDate && e.dateEnd <= endDate;
					} else if (startDate) {
						return e.dateStart >= startDate;
					} else if (endDate) {
						return e.dateEnd <= endDate;
					}
					return true;
				})
				.filter((e) => {
					if (search.trim() === "") {
						return true;
					}
					const searchLower = search.toLowerCase();
					return (
						e.name.toLowerCase().includes(searchLower) ||
						e.location.toLowerCase().includes(searchLower)
					);
				})
				.map((e, i) => {
					// Duration in minutes
					const duration = Math.round(
						(e.dateEnd.getTime() - e.dateStart.getTime()) / (1000 * 60)
					);
					const hours = Math.floor(duration / 60);
					const minutes = duration % 60;
					const durationString = getDurationString(hours, minutes);

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
									color={colorScheme === "dark" ? Palette.white : Palette.black}
								/>
							</View>
							<View style={styles.rightSection}>
								<View style={styles.topTextContainer}>
									<ThemedText type="subtitle" style={styles.textType}>
										{e.name ? e.name : e.type}
									</ThemedText>
									<ThemedText style={styles.duration}>
										{durationString}
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
		</ScrollView>
	);
}
