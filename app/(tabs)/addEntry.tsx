import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { EntryForm } from "@/components/EntryForm";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabTwoScreen() {
	return (
		<SafeAreaView style={styles.safeArea}>
			<ThemedView style={styles.container}>
				<ThemedView style={styles.titleContainer}>
					<ThemedText type="title">Add Entry</ThemedText>
				</ThemedView>
				<EntryForm />
			</ThemedView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: { flex: 1 },
	container: { padding: 32, flex: 1 },
	titleContainer: {
		flexDirection: "row",
		gap: 8,
	},
});
