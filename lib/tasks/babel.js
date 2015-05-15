'use strict';

var path = require('path');

var gulp = require('gulp');
var babel = require('gulp-babel');
var cache = require('gulp-cached');
var bunyan = require('bunyan');
var Promise = require('promise');

var config = require('../config');

var log = bunyan.createLogger({
	name: 'babel'
});

var first = true;

module.exports = function(next) {
	var startTime = Date.now();
	return new Promise(function(resolve, reject) {
		var stream = gulp.src(config.jsSource)
			//.pipe(cache('babel'))
			.pipe(babel())
			.pipe(gulp.dest(config.dest))
			.on('error', function(err) {
				var elapsed = (Date.now() - startTime);
				log.error(colors.red('failed in', elapsed, 'ms'));
				reject(err);
			})
			.on('end', function() {
				var elapsed = (Date.now() - startTime);
				log.info('completed in', elapsed, 'ms');
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
