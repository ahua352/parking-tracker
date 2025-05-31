export type Coordinate = {
	latitude: number;
	longitude: number;
};

export type Suggestion = {
	placePrediction: {
		place: string;
		placeId: string;
		text: {
			text: string;
			matches?: {
				endOffset: number;
			}[];
		};
		structuredFormat?: {
			mainText: {
				text: string;
				matches?: {
					endOffset: number;
				}[];
			};
			secondaryText: {
				text: string;
			};
		};
		types?: string[];
	};
};
