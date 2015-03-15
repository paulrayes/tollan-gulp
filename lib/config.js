'use strict';

var path = require('path');

var bunyan = require('bunyan');

var log = bunyan.createLogger({
	name: 'tollan'
});

var config = {
	dest: './build/',
	browserifyDependencies: [
		'react/addons',
		'react-router'
	],
	browserifySource: path.normalize(process.cwd() + '/lib/browser.js'),
	jsSource: [
		path.normalize(process.cwd() + '/lib/**/*.{js,jsx}'),
		path.normalize(process.cwd() + '/*.{js,jsx}')
	],
	jsWatch: [
		path.normalize(process.cwd() + '/lib/**/*.{js,jsx}'),
		path.normalize(process.cwd() + '/*.{js,jsx}')
	],
	cssSource: './lib/styles/{main,critical}.less',
	cssWatch: [
		path.normalize(process.cwd() + '/lib/styles/**/*.{less,css}'),
	],
	assetsSource: './lib/assets/*.*',
	dev: (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined),
	staging: (process.env.NODE_ENV === 'staging'),
	prod: (process.env.NODE_ENV === 'production')
};

var filename = path.normalize(process.cwd() + '/tollanfile.js');

var tollanfile = null;
try {
	tollanfile = require(filename);
} catch(err) {
	// Do nothing on error, it doesn't exist
}

if (tollanfile) {
	log.info('Found tollanfile at', filename);
	// Merge them, I'd like to use a module for this but can't find one that merges arrays...
	Object.keys(tollanfile).forEach(function(key) {
		if (Array.isArray(config[key]) && Array.isArray(tollanfile[key])) {
			tollanfile[key].forEach(function(item) {
				config[key].push(item); // Yup might end up with duplicates, I don't care
			});
		} else {
			config[key] = tollanfile[key];
		}
	});
}

module.exports = config;
