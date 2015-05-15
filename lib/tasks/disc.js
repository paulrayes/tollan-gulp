'use strict';

var shell = require('shelljs');
var Promise = require('promise');
var bunyan = require('bunyan');

var config = require('../config');

var log = bunyan.createLogger({
	name: 'disc'
});

var dir = config.dest;
if (config.module) {
	dir = config.demoDest;
}
var src = dir + 'main.js';
var dest = dir + 'disc.html';

module.exports = function() {
	return new Promise(function(resolve, reject) {
		if (config.prod) {
			return resolve();
		}
		var updateStart = Date.now();

		shell.exec('node_modules/.bin/discify ' + src + ' > ' + dest, function(code, output) {
			if (code === 0) {
				log.info('Updated disc.html in ' + (Date.now() - updateStart) + 'ms');
				resolve();
			} else {
				reject(output);
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
