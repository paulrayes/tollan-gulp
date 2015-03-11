'use strict';

var gulp = require('gulp');

var config = require('../config');
var less = require('../tasks/less');
var cssnext = require('../tasks/cssnext');

module.exports = function() {
	gulp.watch(config.cssSource, function() {
		return less().then(cssnext).then(function() {
			// do nothing
		}).catch(function(err) {
			// do nothing
		});
	});
};