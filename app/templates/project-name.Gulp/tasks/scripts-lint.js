'use strict';

const gulp            = require('gulp');
const eslint          = require('gulp-eslint');
const plumber         = require('gulp-plumber');
const gutil           = require('gulp-util');
const gulpif          = require('gulp-if');
const cached          = require('gulp-cached');
const conf            = require('../config');

// Lint all javascript files
gulp.task('scripts:lint', () => {
    return gulp.src([conf.js.src + '/**/*.js', './*Gulp/**/*.js'])
                .pipe(gulpif((global.isWatching), cached('scripts')))
                .pipe(plumber())
                .pipe(eslint())
                .pipe(eslint.format())
                .on('error', gutil.log);
});
