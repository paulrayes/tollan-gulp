'use strict';

var path = require('path');

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var cache = require('gulp-cached');
var bunyan = require('bunyan');
var Promise = require('promise');

var config = require('../config');

var log = bunyan.createLogger({
	name: 'eslint'
});

module.exports = function(next) {
	var startTime = Date.now();
	return new Promise(function(resolve, reject) {
		var failed = false;
		var stream = gulp.src(config.jsAll)
			// These must be first because eslint runs synchronously, so dumb
			.on('error', function(err) {
				var elapsed = (Date.now() - startTime);
				log.error('failed in', elapsed, 'ms');
				reject(err);
			})
			.on('end', function() {
				var elapsed = (Date.now() - startTime);
				log.info('completed in', elapsed, 'ms');
				resolve();
			})
			.pipe(cache('eslint'))
			.pipe(eslint(__dirname + '/../../.eslintrc'))
			.pipe(eslint.format());
	});
};

if (require.main === module) {
	module.exports().then(function() {
		process.exit();
	}).catch(function(err) {
		throw(err);
	});
}
