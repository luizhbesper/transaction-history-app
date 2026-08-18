module.exports = {
	preset: "@react-native/jest-preset",
	// Mirrors the layer aliases in `tsconfig.json` and `metro.config.js`.
	// Reanimated's worklets don't run under Jest; its mock renders the animated components
	// as plain views. These three ship untranspiled ESM, so they have to go through Babel.
	setupFiles: ["react-native-reanimated/mock"],
	// Steers Reanimated's worklet runtime away from its `.native` entry points, which
	// expect a real TurboModule.
	resolver: "react-native-worklets/jest/resolver",
	// Lucide ships ESM with an `.mjs` extension, which the preset's transform misses.
	transform: {
		"^.+\\.(js|ts|tsx|mjs)$": "babel-jest",
		"^.+\\.(bmp|gif|jpg|jpeg|mp4|png|psd|svg|webp)$":
			"@react-native/jest-preset/jest/assetFileTransformer.js",
	},
	moduleFileExtensions: ["js", "jsx", "ts", "tsx", "mjs", "json", "node"],
	transformIgnorePatterns: [
		"node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-reanimated|react-native-worklets|react-native-svg|lucide-react-native|react-native-safe-area-context)/)",
	],
	moduleNameMapper: {
		"^@domain/(.*)$": "<rootDir>/src/domain/$1",
		"^@data/(.*)$": "<rootDir>/src/data/$1",
		"^@application/(.*)$": "<rootDir>/src/application/$1",
		"^@presentation/(.*)$": "<rootDir>/src/presentation/$1",
	},
};
