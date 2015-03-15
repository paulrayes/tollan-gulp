'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var Promise = require('promise');
var bunyan = require('bunyan');

var log = bunyan.createLogger({
	name: 'vendor'
});

var config = require('../config');
var dependencies = config.browserifyDependencies;

var bundler = browserify({
	debug: false, // Gives us sourcemapping
	require: dependencies
});

var rebundle = function() {
	var updateStart = Date.now();
	return new Promise(function(resolve, reject) {
		if (!config.dev) {
			return resolve();
		}
		// Create new bundle
		bundler.bundle()
			.pipe(plumber()) // Fix error handling
			.pipe(source('vendor.js'))
			// Write the output
			.pipe(gulp.dest(config.dest))
			.on('error', function(err) {
				reject(err);
			})
			.on('end', function() {
				var elapsed = (Date.now() - updateStart);
				log.info('[browserify] Updated vendor.js in', elapsed, 'ms');
				resolve();
			});
	});
};

module.exports = rebundle;

if (require.main === module) {
	module.exports().then(function() {
		process.exit();
	}).catch(function(err) {
		throw(err);
	});
}
