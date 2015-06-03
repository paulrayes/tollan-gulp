'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var Promise = require('promise');
var less = require('gulp-less');
var cssnext = require("gulp-cssnext")
var bunyan = require('bunyan');

var config = require('./../config');

var log = bunyan.createLogger({
	name: 'less'
});


module.exports = function() {
	return new Promise(function(resolve, reject) {
		var updateStart = Date.now();
		gulp.src(config.cssSource)
			.pipe(plumber()) // Fix error handling
			.on('error', function(err) {
				reject(err);
			})
			// No uglify in dev env
			.pipe(less())
			/*.pipe(cssnext({
				compress: !config.dev
			}))*/
			.pipe(gulp.dest(config.dest))
			.on('error', function(err) {
				reject(err);
			})
			.on('end', function() {
				var elapsed = (Date.now() - updateStart);
				log.info('Updated styles in', elapsed, 'ms');
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
