'use strict';

var gulp = require('gulp');
var Promise = require('promise');

var config = require('../config');
var recess = require('../tasks/recess');
var less = require('../tasks/less');

module.exports = function() {
	return recess().then(less);
};
