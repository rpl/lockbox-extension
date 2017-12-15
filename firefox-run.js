const path = require('path');
const FirefoxProfile = require('firefox-profile');
const runFirefox = require('fx-runner');

if (!process.argv[2]) {
  console.error("Firefox binary parameter is mandatory");
  process.exit(1);
}

const testProfile = new FirefoxProfile();

// Set the needed preferences in the temporarily created profile.
const customPrefs = require('./jpm-prefs.json');
for (const pref of Object.keys(customPrefs)) {
  testProfile.setPreference(pref, customPrefs[pref]);
}
// Write the preferences in the temp profile.
testProfile.updatePreferences();

// Add the build extension in the temp profile.
testProfile.addExtension(path.resolve('dist/'), function () {
  const runningFirefox = runFirefox({
    // Point to a Firefox binary (a release version of Firefox cannot load unsigned legacy extension
    // even when switching the preferences).
    'binary': process.argv[2],
    // Do not reuse an existent Firefox instance.
    'no-remote': true,

    // Point the new Firefox instance to the temporarily created profile.
    profile: testProfile.path(),
  });
});
