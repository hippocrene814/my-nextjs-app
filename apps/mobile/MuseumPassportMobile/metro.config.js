const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    alias: {
      '@museum-app/shared': path.resolve(__dirname, '../../../packages/shared'),
    },
  },
  watchFolders: [
    path.resolve(__dirname, '../../../packages/shared'),
    path.resolve(__dirname, '../../../node_modules'), 
  ],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
