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
	}));
};

export const EntryContextProvider = ({ children }: { children: ReactNode }) => {
	const database = useSQLiteContext();
	const [entries, setEntries] = useState<Entry[]>([
		// {
		// 	id: 1,
		// 	dateStart: new Date("2023-10-01T14:30:00"),
		// 	dateEnd: new Date("2023-10-01T15:30:00"),
		// 	location: "123 Random St, Some Place, Some City",
		// 	type: EntryType.PARKING,
		// 	name: "Parking 123",
		// 	notes: "Some description about the parking spot",
		// },
		// {
		// 	id: 2,
		// 	dateStart: new Date("2023-10-02T16:30:00"),
		// 	dateEnd: new Date("2023-10-02T18:30:00"),
		// 	location: "456 Random St, Some Place, Some City",
		// 	type: EntryType.WARDEN,
		// 	name: "",
		// 	notes: "",
		// },
		// {
		// 	id: 3,
		// 	dateStart: new Date("2023-10-03T10:30:00"),
		// 	dateEnd: new Date("2023-10-03T12:45:00"),
		// 	location: "789 Random St, Some Place, Some City, Some Long Name",
		// 	type: EntryType.FINE,
		// 	name: "",
		// 	notes: "Museum",
		// },
	]);

	const fetchEntries = async () => {
		try {
			const result = await database.getAllAsync("SELECT * FROM entries");
			const fetchedEntries = mapEntries(result);
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
				"INSERT INTO entries (dateStart, dateEnd, location, type, name, notes) VALUES (?, ?, ?, ?, ?, ?)",
				[
					entry.dateStart.getTime(),
					entry.dateEnd.getTime(),
					entry.location,
					entry.type,
					entry.name,
					entry.notes,
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
				"UPDATE entries SET dateStart = ?, dateEnd = ?, location = ?, type = ?, name = ?, notes = ? WHERE id = ?",
				[
					updatedEntry.dateStart.getTime(),
					updatedEntry.dateEnd.getTime(),
					updatedEntry.location,
					updatedEntry.type,
					updatedEntry.name,
					updatedEntry.notes,
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
