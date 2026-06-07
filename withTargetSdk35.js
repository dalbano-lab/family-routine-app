const { withAppBuildGradle, withProjectBuildGradle } = require('@expo/config-plugins');

const withTargetSdk35 = (config) => {
  config = withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;
    
    // Substitui targetSdkVersion
    contents = contents.replace(
      /targetSdkVersion\s*=?\s*Integer\.parseInt\(findProperty\(['"]android\.targetSdkVersion['"]\)\.toString\(\)\)/,
      'targetSdkVersion 35'
    );
    contents = contents.replace(/targetSdkVersion\s+\d+/g, 'targetSdkVersion 35');
    contents = contents.replace(/targetSdkVersion\s*=\s*\d+/g, 'targetSdkVersion = 35');
    
    // Substitui compileSdkVersion
    contents = contents.replace(/compileSdkVersion\s+\d+/g, 'compileSdkVersion 35');
    contents = contents.replace(/compileSdkVersion\s*=\s*\d+/g, 'compileSdkVersion = 35');
    
    config.modResults.contents = contents;
    return config;
  });

  config = withProjectBuildGradle(config, (config) => {
    let contents = config.modResults.contents;
    contents = contents.replace(/targetSdkVersion\s*=\s*\d+/g, 'targetSdkVersion = 35');
    contents = contents.replace(/compileSdkVersion\s*=\s*\d+/g, 'compileSdkVersion = 35');
    config.modResults.contents = contents;
    return config;
  });

  return config;
};

module.exports = withTargetSdk35;
