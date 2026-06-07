const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = (config) => {
  return withAppBuildGradle(config, (config) => {
    config.modResults.contents = config.modResults.contents
      .replace(/targetSdkVersion\s*=?\s*\d+/g, 'targetSdkVersion = 35')
      .replace(/compileSdkVersion\s*=?\s*\d+/g, 'compileSdkVersion = 35');
    return config;
  });
};