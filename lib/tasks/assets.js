'use strict';

var gulp = require('gulp');
var rsync = require('rsyncwrapper').rsync;
var Promise = require('promise');
var bunyan = require('bunyan');

var config = require('../config');

var log = bunyan.createLogger({
	name: 'assets'
});

module.exports = function() {
	return new Promise(function(resolve, reject) {
		var updateStart = Date.now();
		/*rsync({
			src: config.assetsSource,
			dest: config.dest,
			recursive: true
		}, function (error, stdout, stderr, cmd) {
			if (error) {
				log.error(stderr);
				reject(error);
			} else {
				var elapsed = (Date.now() - updateStart);
				log.info('[gulp] Updated assets in', elapsed, 'ms');
				resolve();
			}
		});*/
		return gulp.src(config.assetsSource)
			.pipe(gulp.dest(config.dest))
			.on('error', function(err) {
				reject(err);
			})
			.on('end', function() {
				var elapsed = (Date.now() - updateStart);
				log.info('Updated assets in', elapsed, 'ms');
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
