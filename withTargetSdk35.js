const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withTargetSdk35(config) {
  return withAppBuildGradle(config, function(config) {
    config.modResults.contents = config.modResults.contents
      .replace(/targetSdkVersion\s*=?\s*\d+/g, 'targetSdkVersion = 35')
      .replace(/compileSdkVersion\s*=?\s*\d+/g, 'compileSdkVersion = 35');
    return config;
  });
};