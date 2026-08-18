module.exports = {
	presets: ["module:@react-native/babel-preset"],
	// Reanimated 4 compiles its worklets through this plugin; it must stay last.
	plugins: ["react-native-worklets/plugin"],
};
