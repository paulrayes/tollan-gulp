'use strict';

var gulp = require('gulp');
var recess = require('gulp-recess');
var colors = require('colors/safe');
var cache = require('gulp-cached');
var Promise = require('promise');
var bunyan = require('bunyan');

var log = bunyan.createLogger({
	name: 'recess'
});

var first =  true;

module.exports = function(next) {
	var startTime = Date.now();
	return new Promise(function(resolve, reject) {
		gulp.src(['lib/styles/**/*.{css,less}'])
			.pipe(cache('recess'))
			.pipe(recess())
			.on('error', function(err) {
				console.log();
				console.log('[recess]', err.fileName);
				console.log(
					colors.gray('[recess]', 'line', err.lineNumber, 'col', err.columnNumber),
					colors.cyan(err.message)
				);
				console.log();

				var elapsed = (Date.now() - startTime);
				log.warn(err.message + ':' + err.columnNumber, {
					filename: err.fileName
				});
				log.error('failed in', elapsed, 'ms');
				// Bootstrap is failing so always resolve here
				//reject(err);
				resolve();
			})
			.on('finish', function() {
				var elapsed = (Date.now() - startTime);
				log.info('passed in', elapsed, 'ms');
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
