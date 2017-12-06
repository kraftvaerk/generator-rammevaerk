'use strict';

/*
  gulpfile.js
  ===========
  Rather than manage one giant configuration file responsible
  for creating multiple tasks, each task has been broken out into
  its own file in gulp/tasks. To add a new task, simply add a
  new task file that directory.
*/

const gulp = require('gulp');
const production = process.env.NODE_ENV === 'production' ? true : false;
const taskPath = './<%= answers.projectName %>.Gulp';
const tasks = [
    'styles',
    'scripts',
    'images'
];

// Require tasks in gulp/tasks
if (!production){
    require(taskPath + '/tasks/browser-sync');
    require(taskPath + '/tasks/html');
    require(taskPath + '/tasks/watch');
    require(taskPath + '/tasks/scripts-lint');
    require(taskPath + '/tasks/styles-lint');

    tasks.push('html');
    tasks.push('scripts:lint');
    tasks.push('styles:lint');
}

require(taskPath + '/tasks/images');
require(taskPath + '/tasks/scripts');
require(taskPath + '/tasks/styles');

gulp.task('default', tasks);
