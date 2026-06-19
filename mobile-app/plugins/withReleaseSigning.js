const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Config plugin that injects a release signing config into the generated
 * android/app/build.gradle so that `expo prebuild` produces a project that can
 * build a Play Store ready, release-signed AAB out of the box.
 *
 * The keystore is expected at android/app/release.keystore. Passwords can be
 * overridden with the RELEASE_KEYSTORE_PASSWORD / RELEASE_KEY_PASSWORD env vars.
 */
const KEY_ALIAS = 'ganita-prakash-release';
const DEFAULT_PASSWORD = 'ganitaprakash2024';

function addReleaseSigningConfig(buildGradle) {
  if (buildGradle.includes('release.keystore')) {
    return buildGradle;
  }

  const releaseSigningBlock = `
        release {
            storeFile file('release.keystore')
            storePassword System.getenv('RELEASE_KEYSTORE_PASSWORD') ?: '${DEFAULT_PASSWORD}'
            keyAlias '${KEY_ALIAS}'
            keyPassword System.getenv('RELEASE_KEY_PASSWORD') ?: '${DEFAULT_PASSWORD}'
        }
    }`;

  // Insert the release signing config right after the debug signing config block.
  let updated = buildGradle.replace(
    /signingConfigs\s*\{\s*debug\s*\{[\s\S]*?\}\s*\}/,
    (match) => match.replace(/\}\s*$/, releaseSigningBlock)
  );

  // Point the release build type at the release signing config.
  updated = updated.replace(
    /(release\s*\{\s*\n)(\s*)(\/\/[^\n]*\n\s*\/\/[^\n]*\n\s*)?signingConfig signingConfigs\.debug/,
    `$1$2signingConfig signingConfigs.release`
  );

  return updated;
}

module.exports = function withReleaseSigning(config) {
  return withAppBuildGradle(config, (cfg) => {
    cfg.modResults.contents = addReleaseSigningConfig(cfg.modResults.contents);
    return cfg;
  });
};
