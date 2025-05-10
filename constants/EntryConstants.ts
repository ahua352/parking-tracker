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
