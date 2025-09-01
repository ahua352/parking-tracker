import { Entry, EntryType } from "@/constants/EntryConstants";
import { useSQLiteContext } from "expo-sqlite";
import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from "react";

interface EntryContextType {
	entries: Entry[];
	addEntry: (entry: Entry) => void;
	updateEntry: (entry: Entry) => void;
	deleteEntry: (id: number) => void;
}

const EntryContext = createContext<EntryContextType | undefined>(undefined);

const mapEntries = (result: any[]): Entry[] => {
	return result.map((row: any) => ({
		id: row.id,
		dateStart: new Date(row.dateStart),
		dateEnd: new Date(row.dateEnd),
		location: row.location,
		type: row.type,
		name: row.name,
		notes: row.notes,
		coordinates:
			row.latitude && row.longitude
				? { latitude: row.latitude, longitude: row.longitude }
				: null,
	}));
};

export const EntryContextProvider = ({ children }: { children: ReactNode }) => {
	const database = useSQLiteContext();
	const [entries, setEntries] = useState<Entry[]>([]);

	const fetchEntries = async () => {
		try {
			const result = await database.getAllAsync("SELECT * FROM entries");
			const fetchedEntries = mapEntries(result).sort(
				(a, b) => b.dateStart.getTime() - a.dateStart.getTime()
			);
			setEntries(fetchedEntries);
			console.log("Fetched entries:", fetchedEntries);
		} catch (error) {
			console.error("Error fetching entries:", error);
		}
	};

	useEffect(() => {
		fetchEntries();
	}, []);

	const addEntry = async (entry: Entry) => {
		try {
			// Add entry to database
			await database.runAsync(
				"INSERT INTO entries (dateStart, dateEnd, location, type, name, notes, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
				[
					entry.dateStart.getTime(),
					entry.dateEnd.getTime(),
					entry.location,
					entry.type,
					entry.name,
					entry.notes,
					entry.coordinates?.latitude ?? null,
					entry.coordinates?.longitude ?? null,
				]
			);
			console.log("Entry added to database:", entry);

			fetchEntries();
		} catch (error) {
			console.error("Error adding entry:", error);
		}
	};

	const updateEntry = async (updatedEntry: Entry) => {
		// Update entry in database
		try {
			await database.runAsync(
				"UPDATE entries SET dateStart = ?, dateEnd = ?, location = ?, type = ?, name = ?, notes = ?, latitude = ?, longitude = ? WHERE id = ?",
				[
					updatedEntry.dateStart.getTime(),
					updatedEntry.dateEnd.getTime(),
					updatedEntry.location,
					updatedEntry.type,
					updatedEntry.name,
					updatedEntry.notes,
					updatedEntry.coordinates?.latitude ?? null,
					updatedEntry.coordinates?.longitude ?? null,
					updatedEntry.id,
				]
			);
			console.log("Entry updated in database:", updatedEntry);

			fetchEntries();
		} catch (error) {
			console.error("Error updating entry:", error);
		}
	};

	const deleteEntry = async (id: number) => {
		try {
			await database.runAsync("DELETE FROM entries WHERE id = ?", [id]);
			console.log("Entry deleted from database with ID:", id);

			fetchEntries();
		} catch (error) {
			console.error("Error deleting entry:", error);
		}
	};

	return (
		<EntryContext.Provider
			value={{ entries, addEntry, updateEntry, deleteEntry }}
		>
			{children}
		</EntryContext.Provider>
	);
};

export const useEntryContext = (): EntryContextType => {
	const context = useContext(EntryContext);
	if (!context) {
		throw new Error("useEntryContext must be used within an EntryProvider");
	}
	return context;
};
