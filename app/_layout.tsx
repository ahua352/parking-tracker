import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "react-native-get-random-values";
import { useColorScheme } from "@/hooks/useColorScheme";
import { EntryContextProvider } from "@/contexts/EntryContext";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	const createDbIfNeeded = async (db: SQLiteDatabase) => {
		console.log("Creating database if needed");
		await db.execAsync(
			`CREATE TABLE IF NOT EXISTS entries (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT,
				type TEXT,
				notes TEXT,
				location TEXT,
				dateStart INTEGER,
				dateEnd INTEGER,
				latitude REAL,
            	longitude REAL
			);`
		);
	};

	return (
		<SQLiteProvider databaseName="test.db" onInit={createDbIfNeeded}>
			<EntryContextProvider>
				<ThemeProvider
					value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
				>
					<Stack>
						<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
						<Stack.Screen name="+not-found" />
						<Stack.Screen
							name="editEntry"
							options={{
								title: "Edit Entry",
								headerTitleStyle: { fontSize: 24 },
							}}
						/>
					</Stack>
					<StatusBar style="auto" />
				</ThemeProvider>
			</EntryContextProvider>
		</SQLiteProvider>
	);
}
