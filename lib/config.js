'use strict';

var path = require('path');

var merge = require('deepmerge');
var bunyan = require('bunyan');

var log = bunyan.createLogger({
	name: 'tollan'
});

var config = {
	dest: './build/',
	browserifyDependencies: [
		//'tollan',
		'tollan-client',
		'react',
		'react-router'
	],
	browserifySource: path.normalize(process.cwd() + '/lib/browser.js'),
	jsSource: [
		path.normalize(process.cwd() + '/lib/**/*.{js,jsx}'),
		//path.normalize(process.cwd() + '/node_modules/tollan*/lib/**/*.{js,jsx}'),
		path.normalize(process.cwd() + '/*.{js,jsx}')
	],
	cssSource: './lib/styles/{main,critical}.less',
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
	config = merge(config, tollanfile);
}

module.exports = config;