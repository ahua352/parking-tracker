import "dotenv/config";

export default {
	expo: {
		name: "Parking Tracker",
		slug: "parking-tracker",
		version: "1.0.0",
		orientation: "portrait",
		icon: "./assets/images/icon.png",
		scheme: "myapp",
		userInterfaceStyle: "automatic",
		newArchEnabled: true,
		updates: {
			url: "https://u.expo.dev/98f31805-d6f6-4559-89d3-d69e5c580d6d",
		},
		runtimeVersion: {
			policy: "appVersion",
		},
		ios: {
			supportsTablet: true,
		},
		android: {
			package: "ahua352.parkingtracker",
			adaptiveIcon: {
				foregroundImage: "./assets/images/adaptive-icon.png",
				backgroundColor: "#ffffff",
			},
			softwareKeyboardLayoutMode: "pan",
			config: {
				googleMaps: {
					apiKey: process.env.GOOGLE_MAPS_API_KEY,
				},
			},
		},
		extra: {
			googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
			eas: {
				projectId: "98f31805-d6f6-4559-89d3-d69e5c580d6d",
			},
		},
		web: {
			bundler: "metro",
			output: "static",
			favicon: "./assets/images/favicon.png",
		},
		plugins: [
			"expo-router",
			[
				"expo-splash-screen",
				{
					image: "./assets/images/splash-icon.png",
					imageWidth: 200,
					resizeMode: "contain",
					backgroundColor: "#ffffff",
				},
			],
			"expo-sqlite",
			[
				"expo-location",
				{
					locationAlwaysAndWhenInUsePermission:
						"Allow parking-tracker to use your location.",
				},
			],
		],
		experiments: {
			typedRoutes: true,
		},
	},
};
