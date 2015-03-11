'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var Promise = require('promise');
var cssnext = require("gulp-cssnext")
var bunyan = require('bunyan');

var config = require('./../config');

var log = bunyan.createLogger({
	name: 'cssnext'
});

module.exports = function() {
	return new Promise(function(resolve, reject) {
		var updateStart = Date.now();

		gulp.src(config.dest + '{main,critical}.less')
			.pipe(cssnext({
				compress: !config.debug
			}))
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
