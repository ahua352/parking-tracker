import {
	StyleSheet,
	TextInput,
	View,
	Pressable,
	Button,
	Appearance,
} from "react-native";
import { ThemedText } from "./ThemedText";
import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

enum EntryType {
	PARKING = "Parking",
	WARDEN = "Warden",
	FINE = "Fine",
}

export function EntryForm() {
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
	});

	const [name, setName] = useState("");
	const [location, setLocation] = useState("");
	const [notes, setNotes] = useState("");

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [dropdownValue, setDropdownValue] = useState(null);
	const [dropdownItems, setDropdownItems] = useState(
		Object.values(EntryType).map((type) => ({ label: type, value: type }))
	);

	const [isEditStartDate, setIsEditStartDate] = useState(true);
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
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

	return (
		<View>
			<ThemedText>Entry type</ThemedText>
			<DropDownPicker
				open={dropdownOpen}
				value={dropdownValue}
				items={dropdownItems}
				setOpen={setDropdownOpen}
				setValue={setDropdownValue}
				setItems={setDropdownItems}
				placeholder="Select an option"
				theme={colorScheme === "dark" ? "DARK" : "LIGHT"}
			/>

			<ThemedText>Name</ThemedText>
			<TextInput
				onChangeText={setName}
				value={name}
				placeholder="Optional"
				style={styles.input}
			></TextInput>

			<ThemedText>Start date</ThemedText>
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

			<ThemedText>End date</ThemedText>
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

			{showDatePicker && (
				<DateTimePicker value={startDate} mode="date" onChange={onChangeDate} />
			)}
			{showTimePicker && (
				<DateTimePicker value={startDate} mode="time" onChange={onChangeTime} />
			)}

			<ThemedText>Location</ThemedText>
			<TextInput
				onChangeText={setLocation}
				value={location}
				placeholder="Enter location"
				style={styles.input}
			/>

			<ThemedText>Notes</ThemedText>
			<TextInput
				onChangeText={setNotes}
				value={notes}
				placeholder="Optional"
				style={styles.input}
			/>

			<Button
				title="Save"
				onPress={() => {
					console.log("=~=~=~=~=~=");
					console.log("Saving entry...");
					console.log("Entry type:", dropdownValue);
					console.log("Name:", name);
					console.log("Start date:", startDate);
					console.log("End date:", endDate);
					console.log("Location:", location);
					console.log("Notes:", notes);
				}}
			/>
		</View>
	);
}
