'use strict';

var path = require('path');
var exec = require('child_process').exec;

var bunyan = require('bunyan');
var Promise = require('promise');

var config = require('../config');

var log = bunyan.createLogger({
	name: 'uglify'
});

var dir = config.dest;
if (config.module) {
	dir = config.demoDest;
}
var src = 'main.src.js';
var dest = 'main.js';
var srcMap = 'main.src.map';
var destMap = 'main.map';

var options = '-c unsafe=true,warnings=false -m --screw-ie8';

var uglifyjs = __dirname + '/../../node_modules/.bin/uglifyjs';

module.exports = function(next) {
	var startTime = Date.now();
	return new Promise(function(resolve, reject) {
		var cmd = 'cd ' + dir + ' && ' + uglifyjs + ' ' + options + ' --in-source-map ' + srcMap + ' --source-map ' + destMap + ' ' + src + ' > ' + dest;
		var child = exec(cmd, function (error, stdout, stderr) {
			if (error) {
				var elapsed = (Date.now() - startTime);
				log.error('failed in', elapsed, 'ms');
				reject(error);
			} else {
				if (stderr) {
					log.info(stderr);
				}
				if (stdout) {
					log.info(stdout);
				}
				var elapsed = (Date.now() - startTime);
				log.info('completed in', elapsed, 'ms');
				resolve();
			}
		});
	});
};

if (require.main === module) {
	module.exports().then(function() {
		process.exit();
	}).catch(function(err) {
		throw(err);
	});
}
