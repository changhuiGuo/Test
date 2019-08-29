# Vue.js Chrome DevTools extension

This is a simple Chrome DevTools extension that adds a "Vue.js Properties" sidebar pane to the inspector:

![Screenshot](https://github.com/vuejs/vue-devtools/raw/master/screenshots/todomvc.png)

- `$$owner` is the Vue instance that is managing the currently inspected element.
- All data properties, computed properties & meta properties (e.g. `$index`) on the inspected instance are listed as plain values instead of getter/setters.
- The inspected instance itself is available from the console as `$vue`, so you can directly modify its state or call methods on it.
- `$$scope`, if present, means the instance inherits the parent scope. This object will contain all parent scope data properties that the instance has access to.

## Comptibility

This extension only works with Vue ^0.11.0!

## Installing from the Web Store

https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd

## Installing from Source

1.  Clone the repository: `git clone git://github.com/vuejs/vue-devtools`
2.  Navigate to `chrome://chrome/extensions/` and enable Developer Mode.
3.  Choose "Load unpacked extension"
4.  Open the directory you just cloned (should open with Chrome, otherwise try dragging/dropping the file into Chrome) and follow the prompts to install.