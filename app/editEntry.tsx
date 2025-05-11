import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native";
import { EntryForm } from "@/components/EntryForm";
import { useEntryContext } from "@/contexts/EntryContext";

export default function EditEntryScreen() {
	const params = useLocalSearchParams();
	const entryId: string = Array.isArray(params.id) ? params.id[0] : params.id;
	const { entries } = useEntryContext();
	const entry = entries.find((e) => e.id === Number(entryId));

	return (
		<SafeAreaView style={styles.safeArea}>
			<ThemedView style={styles.container}>
				<EntryForm entry={entry} />
			</ThemedView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: { flex: 1 },
	container: { paddingHorizontal: 32, flex: 1 },
	titleContainer: {
		flexDirection: "row",
		gap: 8,
	},
});
