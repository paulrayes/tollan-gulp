'use strict';

var path = require('path');

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var collapse = require('bundle-collapser/plugin');
//var browserify = require('gulp-browserify');
//var reactify = require('reactify');
var babelify = require('babelify');
var watchify = require('watchify');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var Promise = require('promise');
var bunyan = require('bunyan');

var log = bunyan.createLogger({
	name: 'browserify'
});

var config = require('../config');

var src = config.browserifySource;//path.normalize(process.cwd() + '/lib/browser.js');
//var dependencies = config.browserifyDependencies;
//var dev = config.dev;
//var staging = config.staging;
//var prod = config.prod;
//var dev = !(process.env.NODE_ENV !== 'development');
//var staging = (process.env.NODE_ENV === 'staging');
//var prod = (process.env.NODE_ENV === 'production');

var bundler = browserify({
	extensions: ['.jsx'],
	entries: [src], // Only need initial file, browserify finds the deps
	//transform: [reactify],
	debug: config.dev, // Gives us sourcemapping
	cache: {}, // Requirement of watchify
	packageCache: {}, // Requirement of watchify
	fullPaths: !config.prod // Requirement of watchify and discify
});

bundler.transform(babelify);

if (config.dev) {
	// Do not include external libraries
	config.browserifyDependencies.forEach(function(dep) {
		bundler.external(dep);
	});

	// Watchify doesn't work in dist because we turned off fullPaths
	bundler = watchify(bundler);
}
if (config.prod) {
	// Change require calls to be short
	bundler.plugin(collapse);
}

var rebundle = function() {
	var tasksCompleted = 0;
	var TASK_COUNT = 1;//2;
	var anyFailed = false;
	return new Promise(function(resolve, reject) {
		var updateStart = Date.now();
		// Create new bundle that uses the cache for high performance
		bundler.bundle()
			.pipe(plumber()) // Fix error handling
			.pipe(source('main.js'))
			// Uglify in dist env
			.pipe(gulpif(!config.dev, streamify(uglify())))
			// Write the output
			.pipe(gulp.dest(config.dest))
			.on('error', function(err) {
				reject(err);
			})
			.on('end', function() {
				log.info('[browserify] Updated main.js in ' + (Date.now() - updateStart) + 'ms');
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
