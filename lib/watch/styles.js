'use strict';

var gulp = require('gulp');

var config = require('../config');
var recess = require('../tasks/recess');
var less = require('../tasks/less');

module.exports = function() {
	gulp.watch(config.cssSource, function() {
		return ecess().then(less).then(function() {
			// do nothing
		}).catch(function(err) {
			// do nothing
		});
	});
};