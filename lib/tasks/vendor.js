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

//var vendorBundler = ;
var externalBundlers = [];
if (config.dev) {
	externalBundlers.push({
		name: 'vendor',
		bundler: browserify({
			debug: false, // Gives us sourcemapping
			require: config.browserifyDependencies
		})
	});
}
config.browserifyExternal.forEach(function(dep) {
	externalBundlers.push({
		name: dep,
		bundler: browserify({
			debug: false,
			require: dep
		})
	});
});

var rebundle = function() {
	return new Promise(function(resolve, reject) {
		//if (!config.dev) {
		//	return resolve();
		//}
		var completed = 0;
		var hadError = false;
		externalBundlers.forEach(function(bundler) {
			var updateStart = Date.now();
			bundler.bundler.bundle()
				.pipe(plumber()) // Fix error handling
				.pipe(source(bundler.name + '.js'))
				// Write the output
				.pipe(gulp.dest(config.dest))
				.on('error', function(err) {
					if (!hadError) {
						hadError = true;
						reject(err);
					}
				})
				.on('end', function() {
					var elapsed = (Date.now() - updateStart);
					log.info('[browserify] Updated ' + bundler.name + '.js in', elapsed, 'ms');
					completed++;
					if (completed === externalBundlers.length && !hadError) {
						resolve();
					}
				});
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
