import {
	StyleSheet,
	TextInput,
	View,
	Pressable,
	Button,
	Appearance,
	Platform,
	KeyboardAvoidingView,
	Alert,
	Modal,
} from "react-native";
import { ThemedText } from "./ThemedText";
import React, { useCallback, useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome } from "@expo/vector-icons";
import {
	DropdownItem,
	Entry,
	EntryType,
	iconMap,
} from "@/constants/EntryConstants";
import { useEntryContext } from "@/contexts/EntryContext";
import { useFocusEffect, useRouter } from "expo-router";
import { MapDisplay } from "./MapDisplay";
import { Coordinate } from "@/constants/MapConstants";
import { Palette } from "@/constants/Colors";

export function EntryForm({ entry }: { entry?: Entry }) {
	const router = useRouter();
	const { addEntry, updateEntry, deleteEntry, locations } = useEntryContext();

	const colorScheme = Appearance.getColorScheme();
	const styles = StyleSheet.create({
		input: {
			borderWidth: 1,
			padding: 10,
			paddingVertical: 14,
			borderRadius: 8,
			backgroundColor:
				colorScheme === "dark" ? Palette.blueNavy : Palette.white,
			borderColor: Palette.black,
			color: colorScheme === "dark" ? Palette.greyLight3 : Palette.black,
		},
		container: { marginTop: 16, flexDirection: "column", gap: 16 },
		field: { flexDirection: "column", gap: 6 },
		fieldTitle: { fontWeight: "bold" },
		iconButtonContainer: {
			flexDirection: "row",
			justifyContent: "space-between",
		},
		iconButton: {
			alignItems: "center",
			paddingHorizontal: 4,
			padding: 4,
		},
		iconButtonPressed: {
			backgroundColor:
				colorScheme === "dark" ? Palette.greyDark : Palette.greyLight2,
			borderRadius: 8,
		},
		iconButtonView: {
			width: 20,
			alignItems: "center",
		},
	});

	const [isMapModalVisible, setIsMapModalVisible] = useState(false);
	const [coordinates, setCoordinates] = useState<Coordinate | null>(null);

	const [name, setName] = useState(entry ? entry.name : "");
	const [notes, setNotes] = useState(entry ? entry.notes : "");
	const [location, setLocation] = useState(entry ? entry.location : "");
	const [locationError, setLocationError] = useState(false);
	const [dropdownLocationOpen, setDropdownLocationOpen] = useState(false);
	const [dropdownLocationItems, setDropdownLocationItems] = useState<
		DropdownItem[]
	>([]);

	const [dropdownError, setDropdownError] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [dropdownValue, setDropdownValue] = useState(entry ? entry.type : null);
	const [dropdownItems, setDropdownItems] = useState(
		Object.values(EntryType).map((type) => ({
			label: type,
			value: type,
			icon: () => (
				<View style={{ width: 22, alignItems: "center" }}>
					<FontAwesome
						name={iconMap[type]}
						size={20}
						color={colorScheme === "dark" ? Palette.greyLight3 : Palette.black}
					/>
				</View>
			),
		})),
	);

	const [isEditStartDate, setIsEditStartDate] = useState(true);
	const [startDate, setStartDate] = useState(
		entry ? entry.dateStart : new Date(),
	);
	const [endDate, setEndDate] = useState(entry ? entry.dateEnd : new Date());
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showTimePicker, setShowTimePicker] = useState(false);

	const onChangeDate = (event: any, selectedDate?: Date) => {
		// Update selected date
		if (event.type === "set" && selectedDate) {
			if (isEditStartDate) {
				setStartDate(selectedDate);
			} else {
				setEndDate(selectedDate);
			}
			setShowDatePicker(false);
			setShowTimePicker(true);
			// Close date picker
		} else {
			setShowDatePicker(false);
		}
	};

	const onChangeTime = (event: any, selectedTime?: Date) => {
		// Update selected date with time
		if (event.type === "set" && selectedTime) {
			const updatedDate = new Date(isEditStartDate ? startDate : endDate);
			updatedDate.setHours(selectedTime.getHours());
			updatedDate.setMinutes(selectedTime.getMinutes());
			if (isEditStartDate) {
				setStartDate(updatedDate);
			} else {
				setEndDate(updatedDate);
			}
		}
		// Close time picker
		setShowTimePicker(false);
	};

	const onSave = () => {
		// Check for errors
		// Note: Didn't check for date errors, as dates are automatically populated
		setDropdownError(!dropdownValue ? true : false);
		setLocationError(!location ? true : false);

		if (!dropdownValue || !location) {
			console.log("Error: Missing required fields");
			return;
		} else {
			console.log("No errors");
			if (!entry) {
				const entryNew = {
					id: -1,
					dateStart: startDate,
					dateEnd: endDate,
					location: location,
					type: dropdownValue,
					name: name,
					notes: notes,
					coordinates: coordinates,
				};

				addEntry(entryNew);
				// Update entry
			} else {
				const entryNew = {
					id: entry.id,
					dateStart: startDate,
					dateEnd: endDate,
					location: location,
					type: dropdownValue,
					name: name,
					notes: notes,
					coordinates: coordinates,
				};

				updateEntry(entryNew);
			}
			router.back();
		}
	};

	const onDelete = () => {
		if (entry) {
			Alert.alert(
				"Delete entry",
				"Are you sure you want to delete this entry?",
				[
					{
						text: "Cancel",
						style: "cancel",
					},
					{
						text: "Delete",
						style: "destructive",
						onPress: () => {
							deleteEntry(entry.id);
							router.back();
						},
					},
				],
				{ cancelable: true },
			);
		}
	};

	const onOpenMap = () => {
		setIsMapModalVisible(true);
	};

	const onCloseMap = () => {
		setIsMapModalVisible(false);
	};

	useEffect(() => {
		console.log("Address:", location);
		console.log("Coordinates:", coordinates);
	}, [location, coordinates]);

	useEffect(() => {
		setDropdownLocationItems(
			locations.map((location) => ({
				label: location,
				value: location,
			})),
		);
	}, [locations]);

	// Reset fields when component is focused
	useFocusEffect(
		useCallback(() => {
			setName(entry ? entry.name : "");
			setNotes(entry ? entry.notes : "");
			setLocation(entry ? entry.location : "");
			setStartDate(entry ? new Date(entry.dateStart) : new Date());
			setEndDate(entry ? new Date(entry.dateEnd) : new Date());
			setDropdownValue(entry ? entry.type : null);
			setCoordinates(entry ? entry.coordinates : null);
		}, [entry]),
	);

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<View style={styles.container}>
				<View style={styles.field}>
					<ThemedText style={styles.fieldTitle}>Entry type*</ThemedText>
					<DropDownPicker
						open={dropdownOpen}
						value={dropdownValue}
						items={dropdownItems}
						setOpen={setDropdownOpen}
						setValue={setDropdownValue}
						setItems={setDropdownItems}
						placeholder="Select an option"
						theme={colorScheme === "dark" ? "DARK" : "LIGHT"}
						style={{ borderColor: dropdownError ? Palette.red : Palette.black }}
						placeholderStyle={{
							color: Palette.grey,
						}}
					/>
				</View>
				<View style={styles.field}>
					<ThemedText style={styles.fieldTitle}>Name</ThemedText>
					<TextInput
						onChangeText={setName}
						value={name}
						placeholder="Optional"
						style={styles.input}
						placeholderTextColor={Palette.grey}
					/>
				</View>
				<View style={styles.field}>
					<ThemedText style={styles.fieldTitle}>Start date*</ThemedText>
					<Pressable
						onPress={() => {
							setIsEditStartDate(true);
							setShowDatePicker(true);
						}}
					>
						<TextInput
							value={startDate.toLocaleString()}
							style={styles.input}
							editable={false}
						/>
					</Pressable>
				</View>
				<View style={styles.field}>
					<View style={styles.iconButtonContainer}>
						<ThemedText style={styles.fieldTitle}>End date*</ThemedText>
						<Pressable
							onPress={() => {
								setEndDate(startDate);
							}}
							style={({ pressed }: { pressed: boolean }) => [
								styles.iconButton,
								pressed && styles.iconButtonPressed,
							]}
						>
							<View style={styles.iconButtonView}>
								<FontAwesome
									name={"arrow-down"}
									size={20}
									color={colorScheme === "dark" ? Palette.white : Palette.black}
								/>
							</View>
						</Pressable>
					</View>
					<Pressable
						onPress={() => {
							setIsEditStartDate(false);
							setShowDatePicker(true);
						}}
					>
						<TextInput
							value={endDate.toLocaleString()}
							style={styles.input}
							editable={false}
						/>
					</Pressable>
				</View>

				{/* Note: Didn't limit times */}
				{showDatePicker && (
					<DateTimePicker
						value={isEditStartDate ? startDate : endDate}
						mode="date"
						onChange={onChangeDate}
						minimumDate={isEditStartDate ? undefined : startDate}
						maximumDate={isEditStartDate ? endDate : new Date()}
					/>
				)}
				{showTimePicker && (
					<DateTimePicker
						value={isEditStartDate ? startDate : endDate}
						mode="time"
						onChange={onChangeTime}
					/>
				)}
				<View style={styles.field}>
					<View style={styles.iconButtonContainer}>
						<ThemedText style={styles.fieldTitle}>Location*</ThemedText>
						<Pressable onPress={onOpenMap} style={styles.iconButton}>
							<View style={styles.iconButtonView}>
								<FontAwesome
									name={"map"}
									size={20}
									color={colorScheme === "dark" ? Palette.white : Palette.black}
								/>
							</View>
						</Pressable>
					</View>
					<DropDownPicker
						open={dropdownLocationOpen}
						value={location}
						items={dropdownLocationItems}
						setOpen={setDropdownLocationOpen}
						setValue={setLocation}
						setItems={setDropdownLocationItems}
						placeholder="Select an option"
						theme={colorScheme === "dark" ? "DARK" : "LIGHT"}
						style={{ borderColor: dropdownError ? Palette.red : Palette.black }}
						placeholderStyle={{
							color: Palette.grey,
						}}
						searchable={true}
						searchPlaceholder="Search..."
					/>
				</View>
				<View style={styles.field}>
					<ThemedText style={styles.fieldTitle}>Notes</ThemedText>
					<TextInput
						onChangeText={setNotes}
						value={notes}
						placeholder="Optional"
						style={styles.input}
						placeholderTextColor={Palette.grey}
					/>
				</View>

				<View style={{ marginTop: 24 }}>
					<Pressable
						onPress={onSave}
						style={{
							backgroundColor: Palette.blue,
							borderRadius: 12,
							paddingVertical: 12,
							alignItems: "center",
						}}
					>
						<ThemedText style={{ color: Palette.white, fontWeight: "bold" }}>
							Save
						</ThemedText>
					</Pressable>
				</View>

				{entry && (
					<View style={{ marginTop: 8 }}>
						<Pressable
							onPress={onDelete}
							style={{
								backgroundColor: Palette.red,
								borderRadius: 12,
								paddingVertical: 12,
								alignItems: "center",
							}}
						>
							<ThemedText style={{ color: Palette.white, fontWeight: "bold" }}>
								Delete
							</ThemedText>
						</Pressable>
					</View>
				)}
			</View>

			<Modal
				visible={isMapModalVisible}
				animationType="slide"
				onRequestClose={onCloseMap}
				transparent={false}
			>
				<View
					style={{
						flex: 1,
						backgroundColor:
							colorScheme === "dark" ? Palette.black : Palette.white,
					}}
				>
					<View
						style={{
							padding: 16,
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<ThemedText type="title" style={{ fontSize: 24 }}>
							Select Location
						</ThemedText>
						<Pressable
							onPress={onCloseMap}
							style={{
								padding: 4,
								paddingHorizontal: 8,
								width: 50,
								alignItems: "center",
							}}
						>
							<FontAwesome
								name={"check"}
								size={24}
								color={
									colorScheme === "dark" ? Palette.greyLight3 : Palette.black
								}
							/>
						</Pressable>
					</View>
					<MapDisplay
						location={location}
						setLocation={setLocation}
						coordinates={coordinates}
						setCoordinates={setCoordinates}
						setDropdownLocationItems={setDropdownLocationItems}
					/>
				</View>
			</Modal>
		</KeyboardAvoidingView>
	);
}
