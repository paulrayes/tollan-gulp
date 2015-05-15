'use strict';

//var spawn = require('child_process').spawn;

var Promise = require('promise');

var spawn = require('../spawn');
var config = require('../config');
var jshint = require('../tasks/jshint');
var browserify = require('../tasks/browserify');
//var vendor = require('../tasks/vendor');
var uglify = require('../tasks/uglify');
var disc = require('../tasks/disc');
var babel = require('../tasks/babel');

module.exports = function() {
	if (config.module) {
		if (config.dev) {
			return jshint().then(function() {
				return Promise.all([
					browserify(),
					babel()
				]);
			});
		} else if (config.staging) {
			return jshint().then(function() {
				return Promise.all([
					browserify().then(uglify).then(disc),
					babel()
				]);
			});
		} else {
			return jshint().then(function() {
				return Promise.all([
					browserify().then(uglify),
					babel()
				]);
			});
		}
	} else {
		if (config.dev) {
			return Promise.all([
				jshint().then(browserify),
				spawn('vendor')
			]);
		} else if (config.staging) {
			return Promise.all([
				jshint().then(browserify).then(uglify).then(disc),
				spawn('vendor')
			]);
		} else {
			return Promise.all([
				jshint().then(browserify).then(uglify),
				spawn('vendor')
			]);
		}
	}
};
