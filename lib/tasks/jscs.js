'use strict';

var path = require('path');

var gulp = require('gulp');
var jscs = require('gulp-jscs');
var colors = require('colors/safe');
var cache = require('gulp-cached');
var bunyan = require('bunyan');
var Promise = require('promise');

var config = require('../config');

var log = bunyan.createLogger({
	name: 'jscs'
});

var first = true;

var js = [
	path.normalize(process.cwd() + '/lib/**/*.{js,jsx}'),
	path.normalize(process.cwd() + '/*.{js,jsx}')
];

module.exports = function() {
	var startTime = Date.now();
	return new Promise(function(resolve, reject) {
		var failed = false;
		gulp.src(config.jsSource)
			.pipe(cache('jscs'))
			.pipe(jscs({
				configPath: __dirname + '/../../.jscsrc'
			}))
			.on('error', function(err) {
				failed = true;
				if (first) {
					log.fatal(err.message);
				}
				reject(err);
			})
			.on('finish', function() {
				first = false;
				var elapsed = (Date.now() - startTime);
				if (failed) {
					log.warn(colors.red('ailed in', elapsed, 'ms'));
				} else {
					log.info('passed in', elapsed, 'ms');
				}
				resolve();
			});
	});
};

if (require.main === module) {
	module.exports().then(function() {
		process.exit();
	}).catch(function(err) {
		throw(err);
	});
}
