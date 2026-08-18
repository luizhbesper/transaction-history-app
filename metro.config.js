const path = require("node:path");
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

/**
 * Layer aliases, declared here for Metro, in `tsconfig.json` for the compiler and in
 * `jest.config.js` for tests — the three resolvers share no configuration.
 *
 * Rewritten by hand rather than through `extraNodeModules`, which treats a leading `@`
 * as an npm scope and so never sees `@domain/transaction` as a prefix plus a subpath.
 */
const LAYER_ALIAS = /^@(domain|data|application|presentation)\/(.+)$/;

/**
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
	resolver: {
		resolveRequest: (context, moduleName, platform) => {
			const alias = LAYER_ALIAS.exec(moduleName);
			const target = alias
				? path.resolve(__dirname, "src", alias[1], alias[2])
				: moduleName;

			return context.resolveRequest(context, target, platform);
		},
	},
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
