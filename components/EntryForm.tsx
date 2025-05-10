import { StyleSheet, ScrollView, TextInput } from "react-native";
import { ThemedText } from "./ThemedText";
import { useState } from "react";

export function EntryForm() {
	const [name, setName] = useState("");

	return (
		<ScrollView>
			<ThemedText>Name</ThemedText>
			<TextInput
				onChangeText={setName}
				value={name}
				placeholder="Optional"
				style={{ borderWidth: 1, padding: 8, borderRadius: 4 }}
			></TextInput>
		</ScrollView>
	);
}

const styles = StyleSheet.create({});
