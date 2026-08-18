module.exports = {
	preset: "@react-native/jest-preset",
	// Mirrors the layer aliases in `tsconfig.json` and `metro.config.js`.
	moduleNameMapper: {
		"^@domain/(.*)$": "<rootDir>/src/domain/$1",
		"^@data/(.*)$": "<rootDir>/src/data/$1",
		"^@application/(.*)$": "<rootDir>/src/application/$1",
		"^@presentation/(.*)$": "<rootDir>/src/presentation/$1",
	},
};
