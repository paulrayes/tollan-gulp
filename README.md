tollan-gulp
===========

Set of build tools designed to be used with Tollan applications/modules.

These tools are highly opinionated and thus will not be good for all projects. Some configuration is possible with the addition of a `tollanfile.js`.

Tasks are in the form of promises, which may be combined to form your build sequence just like promises in your source code. Gulp is only used for its file streaming and watching capabilities; tasks are not actual Gulp tasks.

Getting Started
---------------

Install this, plus Gulp and bunyan:

```sh
npm install --save gulp tollan-gulp bunyan
```

Create a `Gulpfile.js` next to your `package.json` with something like the following:

```js
'use strict';

var gulp = require('gulp');
var tasks = require('tollan-gulp');

gulp.task('default', function() {
	return Promise.all([
		tasks.composite.scripts()
	]).then(function() {
		return;
	}).catch(function(err) {
		throw (err);
	});
});

gulp.task('setWatch', function() {
	tasks.config.watch = true;
});

gulp.task('watch', ['setWatch', 'default'], function() {
	return tasks.watch.scripts();
});
```

Create a `tollanfile.js` with, at minimum, the following:

```js
'use strict';

module.exports = {
	// Put your configuration here
};
```

Add the following to the "scripts" section of your `package.json` file:

```json
{
	"build": "gulp | bunyan --output short --color --time local",
	"watch": "gulp watch | bunyan --output short --color --time local"
}
```

Environments
------------

NODE_ENV can be set to one of the following three values:

- `development`: Generally used with `gulp watch`, enables all debug logging, source maps, no minification.
- `production`: Debug features disabled, minification enabled
- `staging`: Designed for use with continuous integration or a staging server. Similar to `production`.

Tasks
-----

The following tasks are provided:

**Javascript tasks**:

- `tasks.jshint`: Lints your code using eslint
- `tasks.babel`: Transforms your Javascript source files from ES6 to ES5 using Babel, and places the resulting files in the destination directory. Only used for module development, so that babelify is not needed when installed to speed up application browserify bundling and allow the module to run in standard Node.js without babel or `--harmony`.
- `tasks.browserify`: Browserifies your module. Includes babelify and source maps. Does not include any modules listed in `browserifyExternal` or `browserifyDependencies`. Resulting file is named `main.src.js` in prod/staging and `main.js` in dev. If building a module it will build the demo scripts instead.
- `tasks.uglify`: Uglifies `main.src.js` to give `main.js`. If building a module it will uglify the demo browserify bundle instead. Unsafe and non-IE8-compatible compression is enabled, thus it may break some bundles.
- `tasks.disc`: Runs your browserify bundle `main.js` through disc to create a dependency visualization. Resulting file is named `disc.html`. If building a module it will discify the demo browserify bundle instead.
- `tasks.vendor`: Browserifies your `browserifyExternal` modules into a `vendor.js`, and browserifies each `browserifyDependencies` into a file named to match the module name. Also uglifies in staging and production. Should not be used with modules.

**LESS style tasks**:

- `tasks.recess`: Lints your styles using recess
- `tasks.less`: Builds your main and critical styles from LESS to CSS
- `tasks.cssnext`: Runs cssnext on your built main and critical CSS, overwriting them

**Misc. tasks**:

- `tasks.assets`: Copies your asset files to the destination directory.
- `tasks.spawn`: Runs a task in a separate Node process. Give the task filename as an argument without the extension.

**Composite tasks**: These combine several af the above tasks into common workflows

- `tasks.composite.scripts`: Runs all applicable Javascript tasks for the current environment
- `tasks.composite.styles`: Runs less then cssnext

**Watch tasks**: Similar to composite tasks but watch your source files for changes

- `tasks.watch.scripts`: Runs babel, browserify, and/or disc tasks when your scripts change
- `tasks.watch.styles`: Runs less then cssnext when your styles change
- `tasks.watch.assets`: Runs the assets task when your asset files change

Configuration
-------------

The default configuration will work for some standalone applications. You can override any configuration by creating a `tollanfile.js` next to your package.json.

For a list of all settings with a description of what they do and the default values, see the source of `lib/config.js`.

TODO
----

- Either remove the dependency on Gulp, or implement tasks as proper Gulp tasks. Gulp 3 does not have a good sequence runner, which is why I used promises; I'm told Gulp 4.0 adds this functionality.
- Improve error handling, it's a bit buggy. I'm told Gulp 4.0 is significantly better in this aspect.
- Test with Gulp 4.0 so I can do the above two
- Improve commenting and documentation
- Add configuration settings for more things.


License
-------

	   Copyright 2014-2015 Paul Rayes

	   Licensed under the Apache License, Version 2.0 (the "License");
	   you may not use this file except in compliance with the License.
	   You may obtain a copy of the License at

	       http://www.apache.org/licenses/LICENSE-2.0

	   Unless required by applicable law or agreed to in writing, software
	   distributed under the License is distributed on an "AS IS" BASIS,
	   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	   See the License for the specific language governing permissions and
	   limitations under the License.
