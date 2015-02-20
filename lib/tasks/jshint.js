'use strict';

var path = require('path');

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var colors = require('colors/safe');
var react = require('gulp-react');
var cache = require('gulp-cached');
var bunyan = require('bunyan');
var Promise = require('promise');

var config = require('../config');

var log = bunyan.createLogger({
	name: 'jshint'
});

var first = true;

module.exports = function(next) {
	var startTime = Date.now();
	return new Promise(function(resolve, reject) {
		var failed = false;
		gulp.src(config.jsSource)
			.pipe(cache('jshint'))
			.pipe(react())
			//.pipe(jshint(__dirname + '/../../.jshintrc'))
			.pipe(jshint.reporter('jshint-stylish'))
			.pipe(jshint.reporter('fail'))
			.on('error', function(err) {
				failed = true;
				if (first) {
					log.fatal(err);
				}
				reject(err);
			})
			.on('finish', function() {
				first = false;
				var elapsed = (Date.now() - startTime);
				if (failed) {
					log.error(colors.red('failed in', elapsed, 'ms'));
					reject();
				} else {
					log.info('passed in', elapsed, 'ms');
					resolve();
				}
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
