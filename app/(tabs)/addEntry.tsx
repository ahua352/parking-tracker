import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { EntryForm } from "@/components/EntryForm";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

export default function TabTwoScreen() {
	const params = useLocalSearchParams();
	const [entry, setEntry] = useState(undefined);
	const pathname = usePathname();
	const router = useRouter();

	// Clear params if navigating via tab bar
	const navigation = useNavigation<BottomTabNavigationProp<any>>();
	useEffect(() => {
		const unsubscribe = navigation.addListener("tabPress", () => {
			if (Object.keys(params).length > 0 && pathname === "/addEntry") {
				router.replace("/addEntry");
			}
		});
		return unsubscribe;
	}, [navigation, params, pathname, router]);

	// Set entry
	useEffect(() => {
		if (params.entry) {
			setEntry(JSON.parse(params.entry as string));
		} else {
			setEntry(undefined);
		}
	}, [params.entry]);

	return (
		<SafeAreaView style={styles.safeArea}>
			<ThemedView style={styles.container}>
				<ThemedView style={styles.titleContainer}>
					<ThemedText type="title">Add Entry</ThemedText>
				</ThemedView>
				<EntryForm entry={entry} />
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
