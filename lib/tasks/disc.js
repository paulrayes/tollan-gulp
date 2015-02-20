'use strict';

var shell = require('shelljs');
var Promise = require('promise');
var bunyan = require('bunyan');

var config = require('../config');

var log = bunyan.createLogger({
	name: 'disc'
});

module.exports = function() {
	return new Promise(function(resolve, reject) {
		if (config.prod) {
			return resolve();
		}
		var updateStart = Date.now();
		shell.exec('discify build/main.js > build/disc.html', function(code, output) {
			if (code === 0) {
				log.info('[discify] Updated disc.html in ' + (Date.now() - updateStart) + 'ms');
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
