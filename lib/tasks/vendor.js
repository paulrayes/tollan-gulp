'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var browserify = require('browserify');
var collapse = require('bundle-collapser/plugin');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer')
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var Promise = require('promise');
var bunyan = require('bunyan');

var log = bunyan.createLogger({
	name: 'vendor'
});

var config = require('../config');

var externalBundlers = [];

function makeBundler(name, deps) {
	var bundler = browserify({
		debug: false, // No source maps, these are 3rd party files and we don't care
		require: deps
	})
	if (config.prod) {
		// Change require calls to be short
		//bundler.plugin(collapse);
	}
	externalBundlers.push({
		name: name,
		bundler: bundler
	});
}

if (config.dev) {
	// Make a bundler for the vendor.js file
	makeBundler('vendor', config.browserifyDependencies);
	/*externalBundlers.push({
		name: 'vendor',
		bundler: browserify({
			debug: false, // No source maps, these are 3rd party files and we don't care
			require: config.browserifyDependencies
		})
	});*/
}
config.browserifyExternal.forEach(function(dep) {
	// Make a bundler for each external bundle
	makeBundler(dep, dep);
	/*externalBundlers.push({
		name: dep,
		bundler: browserify({
			debug: false, // No source maps, these are 3rd party files and we don't care
			require: dep
		})
	});*/
});

var rebundle = function() {
	return new Promise(function(resolve, reject) {
		var completed = 0;
		var hadError = false;
		// Make a bundle for each file
		externalBundlers.forEach(function(bundler) {
			var updateStart = Date.now();
			bundler.bundler.bundle()
				.pipe(plumber()) // Fix error handling
				// Turn browserify stream into Vinyl stream
				.pipe(source(bundler.name + '.js'))
				// Turn Vinyl stream into buffered Vinyl stream
				.pipe(buffer())
				// Uglify in dist environments
				.pipe(gulpif(!config.dev, uglify()))
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
					log.info('Updated ' + bundler.name + '.js in', elapsed, 'ms');
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
