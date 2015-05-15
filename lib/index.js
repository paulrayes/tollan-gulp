'use strict';

var bunyan = require('bunyan');

var log = bunyan.createLogger({
	name: 'tollan'
});

if (process.env.NODE_ENV === undefined) {
	var env = 'DEVELOPMENT';
} else {
	var env = process.env.NODE_ENV.toUpperCase();
}

log.info('Initializing CLI for ', env, ' environment.');

module.exports = {
	gulp: require('gulp'),
	Promise: require('promise'),
	config: require('./config'),
	assets: require('./tasks/assets'),
	browserify: require('./tasks/browserify'),
	disc: require('./tasks/disc'),
	jshint: require('./tasks/jshint'),
	less: require('./tasks/less'),
	recess: require('./tasks/recess'),
	vendor: require('./tasks/vendor'),
	babel: require('./tasks/babel'),
	composite: {
		scripts: require('./composite/scripts'),
		styles: require('./composite/styles')
	},
	watch: {
		scripts: require('./watch/scripts'),
		styles: require('./watch/styles'),
		assets: require('./watch/assets')
	},
	spawn: require('./spawn')
};
