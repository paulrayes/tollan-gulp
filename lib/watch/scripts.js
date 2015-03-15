'use strict';

var gulp = require('gulp');

var config = require('../config');
var jshint = require('../tasks/jshint');
var browserify = require('../tasks/browserify');
var disc = require('../tasks/disc');

module.exports = function() {
	gulp.watch(config.jsWatch, function() {
		return jshint().then(browserify).then(disc).then(function() {
			// do nothing
		}).catch(function(err) {
			// do nothing
		});
	});
};
