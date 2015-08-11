var gulp    = require('gulp'),
	plugins = require('gulp-load-plugins')();

require('./tasks/gulpfile-predev')(gulp, plugins)
require('./tasks/gulpfile-dev')(gulp, plugins)
require('./tasks/gulpfile-zip')(gulp, plugins)
