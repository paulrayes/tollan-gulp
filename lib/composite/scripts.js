'use strict';

//var spawn = require('child_process').spawn;

var Promise = require('promise');

var spawn = require('../spawn');
var config = require('../config');
var jshint = require('../tasks/jshint');
var browserify = require('../tasks/browserify');
//var vendor = require('../tasks/vendor');
var disc = require('../tasks/disc');

module.exports = function() {
	if (config.dev || config.staging) {
		return Promise.all([
			jshint().then(browserify).then(disc),
			spawn('vendor')
		]);
	} else {
		return Promise.all([
			jshint().then(browserify),
			spawn('vendor')
		]);
	}
};
