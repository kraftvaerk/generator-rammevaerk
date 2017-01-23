'use strict';

const gulp            = require('gulp');
const eslint          = require('gulp-eslint');
const plumber         = require('gulp-plumber');
const gutil           = require('gulp-util');
const cached          = require('gulp-cached');
const conf            = require('../config');

// Lint all javascript files
gulp.task('scripts:lint', () => {
    return gulp.src([conf.js.src + '/**/*.js', './*Gulp/**/*.js'])
                .pipe(global.isWatching ? cached('scripts') : gutil.noop())
                .pipe(plumber())
                .pipe(eslint())
                .pipe(eslint.format())
                .on('error', gutil.log);
});
