'use strict';

var gulp = require('gulp');

var config = require('../config');
var jshint = require('../tasks/jshint');
var browserify = require('../tasks/browserify');
var disc = require('../tasks/disc');
var babel = require('../tasks/babel');

module.exports = function() {
	if (config.prod) {
		return;
	}
	gulp.watch(config.jsWatch, function() {
		if (config.module) {
			return jshint().then(function() {
				if (config.dev) {
					return Promise.all([
						browserify().then(disc),
						babel()
					]);
				} else if (config.staging) {
					return Promise.all([
						browserify().then(disc),
						babel()
					]);
				} else {
					return;
				}
			}).then(function() {
				// do nothing
			}).catch(function(err) {
				// do nothing
			});
		} else {
			return jshint().then(function() {
				if (config.dev) {
					return browserify().then(disc);
				} else if (config.staging) {
					return browserify().then(disc);
				}
			}).then(function() {
				// do nothing
			}).catch(function(err) {
				// do nothing
			});
		}
	});
};
