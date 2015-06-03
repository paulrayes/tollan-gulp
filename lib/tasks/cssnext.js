'use strict';

var gulp = require('gulp');
var fs = require('fs');
var plumber = require('gulp-plumber');
var Promise = require('promise');
//var cssnext = require("gulp-cssnext")
var cssnext = require('cssnext');
var bunyan = require('bunyan');

var config = require('./../config');

var log = bunyan.createLogger({
	name: 'cssnext'
});

function nextify(file) {
	return new Promise(function(resolve, reject) {
		try {
			var input = fs.readFileSync(config.dest + file, 'utf8');

			var output = cssnext(input);
			fs.writeFileSync(config.dest + file, output);
			resolve();
		} catch (err) {
			reject(err);
		}
	});
}

module.exports = function() {
	var updateStart = Date.now();
	return nextify('main.css').then(function() {
		return nextify('critical.css');
	}).then(function() {
		var elapsed = (Date.now() - updateStart);
		log.info('Updated styles in', elapsed, 'ms');
	});
	//return new Promise(function(resolve, reject) {
	//	var updateStart = Date.now();


		/*gulp.src(config.dest + '{main,critical}.css')
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
			});*/
	//});
};
