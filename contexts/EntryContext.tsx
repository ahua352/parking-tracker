import { Entry, EntryType } from "@/constants/EntryConstants";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface EntryContextType {
	entries: Entry[];
	addEntry: (entry: Entry) => void;
}

const EntryContext = createContext<EntryContextType | undefined>(undefined);

export const EntryContextProvider = ({ children }: { children: ReactNode }) => {
	const [entries, setEntries] = useState<Entry[]>([
		{
			id: 1,
			dateStart: new Date("2023-10-01T14:30:00"),
			dateEnd: new Date("2023-10-01T15:30:00"),
			location: "123 Random St, Some Place, Some City",
			geocode: [-36.84845, 174.762192],
			type: EntryType.PARKING,
			name: "Parking 123",
			notes: "Some description about the parking spot",
			files: [],
		},
		{
			id: 2,
			dateStart: new Date("2023-10-02T16:30:00"),
			dateEnd: new Date("2023-10-02T18:30:00"),
			location: "456 Random St, Some Place, Some City",
			geocode: [-36.867697, 174.7190158],
			type: EntryType.WARDEN,
			name: "",
			notes: "",
			files: [],
		},
		{
			id: 3,
			dateStart: new Date("2023-10-03T10:30:00"),
			dateEnd: new Date("2023-10-03T12:45:00"),
			location: "789 Random St, Some Place, Some City, Some Long Name",
			geocode: [-36.8607564, 174.77781],
			type: EntryType.FINE,
			name: "",
			notes: "Museum",
			files: [],
		},
	]);

	const addEntry = (entry: Entry) => {
		setEntries((prevEntries) => [...prevEntries, entry]);
	};

	return (
		<EntryContext.Provider value={{ entries, addEntry }}>
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
