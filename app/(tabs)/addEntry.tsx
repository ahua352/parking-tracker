import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { EntryForm } from "@/components/EntryForm";

export default function AddEntryScreen() {
	return (
		<ThemedView style={styles.container}>
			<EntryForm entry={undefined} />
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: { paddingHorizontal: 32, flex: 1 },
	titleContainer: {
		flexDirection: "row",
		gap: 8,
	},
});
