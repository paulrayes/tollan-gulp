'use strict';

var path = require('path');
var fs = require('fs');

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var transform = require('vinyl-transform');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer')
var browserify = require('browserify');
var collapse = require('bundle-collapser/plugin');
var watchify = require('watchify');
//var gulpif = require('gulp-if');
//var uglify = require('gulp-uglify');
var babelify = require('babelify');
var sourcemaps = require('gulp-sourcemaps');
var exorcist = require('exorcist');
var disc = require('disc');
var Promise = require('promise');
var bunyan = require('bunyan');

var log = bunyan.createLogger({
	name: 'browserify'
});

var config = require('../config');

var src = config.browserifySource();

var bundler = browserify({
	entries: [src], // Only need initial file, browserify finds the deps
	debug: true, // Gives us sourcemapping
	cache: {}, // Requirement of watchify
	packageCache: {}, // Requirement of watchify
	fullPaths: !config.prod // Requirement of watchify and discify
});

// Do not include modules we're going to load asynchronously
config.browserifyExternal.forEach(function(dep) {
	bundler.external(dep);
});

if (config.dev) {
	// Do not include external libraries, they're in a separate file
	config.browserifyDependencies.forEach(function(dep) {
		bundler.external(dep);
	});

	// Watchify doesn't work in dist because we turned off fullPaths
	if (config.watch) {
		bundler = watchify(bundler, {
			delay: 10
		});
	}
}

bundler.transform(babelify);

if (config.prod) {
	// Change require calls to be short
	//bundler.plugin(collapse);
}

var dir = config.dest;
if (config.module) {
	dir = config.demoDest;
}
var dest = 'main.src.js';
var destMap = 'main.src.map';
if (config.dev) {
	dest = 'main.js';
	destMap = 'main.map';
}

var rebundle = function() {
	return new Promise(function(resolve, reject) {
		var updateStart = Date.now();
		// Create new bundle that uses the cache for high performance
		bundler.bundle()
			.on('error', function(err) {
				reject(err);
			})
			.on('end', function() {
				log.info('Updated main bundle in ' + (Date.now() - updateStart) + 'ms');
				resolve();
			})
		 	// Fix error handling
			//.pipe(plumber())
			// Turn browserify stream into Vinyl stream
			.pipe(source(dest))
			// Turn Vinyl stream into buffered Vinyl stream
			//.pipe(buffer())
			// Start keeping track of source maps, starting with the one created by Browserify
			//.pipe(sourcemaps.init({loadMaps: true}))
			// Uglify in dist environments
			/*.pipe(gulpif(!config.dev, uglify({
				compress: {
					unsafe: true
				}
			})))*/
			// Write the output sourcemaps inline to the file
			//.pipe(sourcemaps.write())
			// Pull the sourcemaps out to a separate file
			.pipe(transform(function () { return exorcist(dir + destMap); }))
			// Write the final js file
			.pipe(gulp.dest(dir));
			// Done;
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
