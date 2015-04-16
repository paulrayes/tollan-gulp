'use strict';

var gulp = require('gulp');

var config = require('../config');
var assets = require('../tasks/assets');

module.exports = function() {
	gulp.watch(config.assetsWatch, assets);
};
