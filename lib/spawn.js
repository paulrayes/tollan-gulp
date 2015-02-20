'use strict';

var spawn = require('child_process').spawn;

var Promise = require('promise');

module.exports = function(taskName) {
	return new Promise(function(resolve, reject) {
		var child = spawn('node', [__dirname + '/tasks/' + taskName + '.js'], { stdio: 'inherit' });

		child.on('close', function(code) {
			if (code === 0) {
				resolve()
			} else {
				reject();
			}
		})
	});
};
