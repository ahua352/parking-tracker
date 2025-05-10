import { StyleSheet, ScrollView, TextInput, View } from "react-native";
import { ThemedText } from "./ThemedText";
import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";

enum EntryType {
	PARKING = "Parking",
	WARDEN = "Warden",
	FINE = "Fine",
}

export function EntryForm() {
	const [name, setName] = useState("");
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [dropdownValue, setDropdownValue] = useState(null);
	const [dropdownItems, setDropdownItems] = useState(
		Object.values(EntryType).map((type) => ({ label: type, value: type }))
	);

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
			/>

			<ThemedText>Name</ThemedText>
			<TextInput
				onChangeText={setName}
				value={name}
				placeholder="Optional"
				style={{ borderWidth: 1, padding: 8, borderRadius: 4 }}
			></TextInput>
		</View>
	);
}

const styles = StyleSheet.create({});
