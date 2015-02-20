'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var Promise = require('promise');
var less = require('gulp-less');
var cleancss = new (require('less-plugin-clean-css'))({advanced: true});
var bunyan = require('bunyan');

var config = require('./../config');

var log = bunyan.createLogger({
	name: 'less'
});


module.exports = function() {
	return new Promise(function(resolve, reject) {
		var updateStart = Date.now();
		if (config.dev) {
			gulp.src(config.cssSource)
				.pipe(plumber()) // Fix error handling
				// No uglify in dev env
				.pipe(less({
				}))
				.pipe(gulp.dest(config.dest))
				.on('error', function(err) {
					reject(err);
				})
				.on('end', function() {
					var elapsed = (Date.now() - updateStart);
					log.info('[less] Updated styles in', elapsed, 'ms');
					resolve();
				});
		} else {
			gulp.src(config.cssSource)
				.pipe(plumber()) // Fix error handling
				// Uglify in dist env
				.pipe(less({
					plugins: [cleancss]
				}))
				.pipe(gulp.dest(config.dest))
				.on('error', function(err) {
					reject(err);
				})
				.on('end', function() {
					var elapsed = (Date.now() - updateStart);
					log.info('[less] Updated styles in', elapsed, 'ms');
					resolve();
				});
		}
	});	
};

if (require.main === module) {
	module.exports().then(function() {
		process.exit();
	}).catch(function(err) {
		throw(err);
	});
}
