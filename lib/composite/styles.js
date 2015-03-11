'use strict';

var gulp = require('gulp');
var Promise = require('promise');

var config = require('../config');
var less = require('../tasks/less');
var cssnext = require('../tasks/cssnext');

module.exports = function() {
	return less().then(cssnext);
};
