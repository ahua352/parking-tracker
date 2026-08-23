export enum EntryType {
	PARKING = "Parking",
	WARDEN = "Warden",
	FINE = "Fine",
}

// Map entry types to icons
export const iconMap: Record<EntryType, "car" | "shield" | "money"> = {
	[EntryType.PARKING]: "car",
	[EntryType.WARDEN]: "shield",
	[EntryType.FINE]: "money",
};

export interface Entry {
	id: number;
	dateStart: Date;
	dateEnd: Date;
	location: string;
	type: EntryType;
	name: string;
	notes: string;
	coordinates: { latitude: number; longitude: number } | null;
}

export type DropdownItem = {
	label: string;
	value: string;
};
