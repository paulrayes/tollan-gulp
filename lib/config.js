'use strict';

var path = require('path');

var bunyan = require('bunyan');

var log = bunyan.createLogger({
	name: 'tollan'
});

// Default configuration, override by creating a `tollanfile.js` file in your
// module or application.
//
// The defaults assume the following:
// - Your source code is located in the `lib` folder
// - Your demo code (if it's a module) is located in the `demo` folder
// - You have two stylesheets located at `lib/styles`:
//     - `critical.less` is your critical styles which you will inline into the head
//     - `main.less` are the rest of your styles which will be loaded externally
// - Your assets (images etc) are located in `lib/assets`
// - Your entry point for browser code is `lib/browser.js` for an application,
//   or `demo/browser.js` for a module demo

var config = {
	// Destination directory for built files
	// For an application, all built files go here.
	// For a module, all built files needed to require the module go here.
	dest: path.normalize(process.cwd() + '/build/'),

	// For a module, all built demo files go here.
	// For an application, this is not used.
	demoDest: path.normalize(process.cwd() + '/demo/build/'),

	// Modules that should not be included in the main browserify bundle, but in
	// vendor.js instead. This is done to improve build times during development.
	// Your dependencies do not change often, thus if we build them in a separate
	// file, we won't have to re-build them.
	//
	// For example, if you use React for your views, you can list it here like this:
	//
	//     browserifyDependencies: ['react']
	//
	// vendor.js is only created in development mode. In staging and production,
	// dependencies are included in your main.js file.
	browserifyDependencies: [
		//'react/addons',
		//'react-router'
	],

	// Modules that will be loaded asynchronously. This requires cooperation from
	// every place in your code where you require any of these modules, as you must
	// ensure that it has been loaded first. Tollan provides helpers to do this
	// for you; other applications will need to find some other way to do it.
	//
	// Each module in the list will be built into a separate file. For example,
	// if you use markdown-it on one view but not any of your other views, you
	// can build a `markdown-it.js` file with:
	//
	// 	browserifyExternal: ['markdown-it']
	//
	// Included the resulting file in your page with a script tag. Once it has
	// downloaded and parsed, you can `require('markdown-it')` normally.
	browserifyExternal: [],

	// Location of your browserify entry point.
	browserifySource: function() {
		if (config.module) {
			return path.normalize(process.cwd() + '/demo/browser.js');
		} else {
			return path.normalize(process.cwd() + '/lib/browser.js');
		}
	},

	// Array of globs to match all Javascript files in your application, primarily
	// for linting.
	jsAll: [
		path.normalize(process.cwd() + '/{lib,demo,src}/**/*.js'),
		path.normalize('!' + process.cwd() + '/{lib,demo,src}/{assets,build}/**/*.js'),
		path.normalize(process.cwd() + '/*.js')
	],

	// Array of globs to match all source files in your application, but not demo
	// files. Primarily used by the babel task for modules.
	jsSource: [
		path.normalize(process.cwd() + '/{lib,src}/**/*.js'),
		path.normalize('!' + process.cwd() + '/{lib,src}/{assets,build}/**/*.js'),
		path.normalize(process.cwd() + '/*.js')
	],

	// Array of globs to watch for changes to determine when to re-run the
	// scripts composite task.
	jsWatch: [
		path.normalize(process.cwd() + '/{lib,demo,src}/**/*.js'),
		path.normalize('!' + process.cwd() + '/{lib,demo,src}/{assets,build}/**/*.js'),
		path.normalize(process.cwd() + '/*.js')
	],

	// Glob of stylesheet source files. LESS wants only the entry points, not
	// files you will later include.
	cssSource: './lib/styles/{main,critical}.less',

	// Array of globs to watch for changes to determine when to re-run the
	// styles composite task.
	cssWatch: [
		path.normalize(process.cwd() + '/{lib|demo|src}/**/*.{less,css}'),
		path.normalize('!' + process.cwd() + '/{lib|demo|src}/{assets,build}/**/*.{less,css}'),
		path.normalize(process.cwd() + '/*.{less,css}')
	],

	// Glob to match asset files, these will be copied recursively.
	assetsSource: './lib/assets/*',

	// Glob to watch for changes to determine when to re-copy the assets
	assetsWatch: './lib/assets/**/*.*',

	// Boolean flags to identify the current environment
	dev: (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined),
	staging: (process.env.NODE_ENV === 'staging'),
	prod: (process.env.NODE_ENV === 'production'),

	// Whether we are a module or a standalone application. The default is a
	// standalone application.
	module: false,

	// Whether we are watching files for changes. You should not set this in your
	// tollanfile, instead set it in your Gulpfile in response to an input
	// argument.
	watch: false
};

// Location of the tollanfile. This cannot be changed.
var filename = path.normalize(process.cwd() + '/tollanfile.js');

// Attempt to load the tollanfile
var tollanfile = null;
try {
	tollanfile = require(filename);
} catch(err) {
	// Do nothing on error, it doesn't exist
}

if (tollanfile) {
	//log.info('Found tollanfile at', filename);
	// Merge them, I'd like to use a module for this but can't find one that merges arrays properly...
	Object.keys(tollanfile).forEach(function(key) {
		if (Array.isArray(config[key]) && Array.isArray(tollanfile[key])) {
			tollanfile[key].forEach(function(item) {
				config[key].push(item); // Yup might end up with duplicates, I don't care
			});
		} else {
			config[key] = tollanfile[key];
		}
	});
} else {
	log.warn('Could not find tollanfile, continuing with defaults');
}

// Export the final config with application/module overrides applied
module.exports = config;
