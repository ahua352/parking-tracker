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
} from "react-native";
import { ThemedText } from "./ThemedText";
import React, { useCallback, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome } from "@expo/vector-icons";
import { Entry, EntryType, iconMap } from "@/constants/EntryConstants";
import { useEntryContext } from "@/contexts/EntryContext";
import { useFocusEffect, useRouter } from "expo-router";

export function EntryForm({ entry }: { entry?: Entry }) {
	const router = useRouter();
	const { addEntry, updateEntry, deleteEntry } = useEntryContext();

	const colorScheme = Appearance.getColorScheme();
	const styles = StyleSheet.create({
		input: {
			borderWidth: 1,
			padding: 10,
			paddingVertical: 14,
			borderRadius: 8,
			backgroundColor: colorScheme === "dark" ? "#292d3e" : "white",
			borderColor: "black",
			color: colorScheme === "dark" ? "#bfc7d5" : "black",
		},
		container: { marginTop: 16, flexDirection: "column", gap: 16 },
		field: { flexDirection: "column", gap: 6 },
		fieldTitle: { fontWeight: "bold" },
	});

	const [name, setName] = useState(entry ? entry.name : "");
	const [notes, setNotes] = useState(entry ? entry.notes : "");
	const [location, setLocation] = useState(entry ? entry.location : "");
	const [locationError, setLocationError] = useState(false);

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
						color={colorScheme === "dark" ? "#bfc7d5" : "black"}
					/>
				</View>
			),
		}))
	);

	const [isEditStartDate, setIsEditStartDate] = useState(true);
	const [startDate, setStartDate] = useState(
		entry ? entry.dateStart : new Date()
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
				{ cancelable: true }
			);
		}
	};

	// Reset fields when component is focused
	useFocusEffect(
		useCallback(() => {
			setName(entry ? entry.name : "");
			setNotes(entry ? entry.notes : "");
			setLocation(entry ? entry.location : "");
			setStartDate(entry ? new Date(entry.dateStart) : new Date());
			setEndDate(entry ? new Date(entry.dateEnd) : new Date());
			setDropdownValue(entry ? entry.type : null);
		}, [entry])
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
						style={{ borderColor: dropdownError ? "#f44336" : "black" }}
						placeholderStyle={{
							color: "#72777f",
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
						placeholderTextColor="#72777f"
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
					<ThemedText style={styles.fieldTitle}>End date*</ThemedText>
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
					<ThemedText style={styles.fieldTitle}>Location*</ThemedText>
					<TextInput
						onChangeText={setLocation}
						value={location}
						placeholder="Enter location"
						style={[
							styles.input,
							{ borderColor: locationError ? "#f44336" : "black" },
						]}
						placeholderTextColor="#72777f"
					/>
				</View>
				<View style={styles.field}>
					<ThemedText style={styles.fieldTitle}>Notes</ThemedText>
					<TextInput
						onChangeText={setNotes}
						value={notes}
						placeholder="Optional"
						style={styles.input}
						placeholderTextColor="#72777f"
					/>
				</View>

				<View style={{ marginTop: 24 }}>
					<Pressable
						onPress={onSave}
						style={{
							backgroundColor: "#2196f3",
							borderRadius: 12,
							paddingVertical: 12,
							alignItems: "center",
						}}
					>
						<ThemedText style={{ color: "white", fontWeight: "bold" }}>
							Save
						</ThemedText>
					</Pressable>
				</View>

				{entry && (
					<View style={{ marginTop: 8 }}>
						<Pressable
							onPress={onDelete}
							style={{
								backgroundColor: "#f44336",
								borderRadius: 12,
								paddingVertical: 12,
								alignItems: "center",
							}}
						>
							<ThemedText style={{ color: "white", fontWeight: "bold" }}>
								Delete
							</ThemedText>
						</Pressable>
					</View>
				)}
			</View>
		</KeyboardAvoidingView>
	);
}
