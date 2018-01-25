'use strict';

const gulp            = require('gulp');
const cached          = require('gulp-cached');
const plumber         = require('gulp-plumber');
const gutil           = require('gulp-util');
const postcss         = require('gulp-postcss');
const scss            = require('postcss-scss');
const conf            = require('../config');

// Lint all style files
gulp.task('styles:lint', () => {
    return gulp.src([conf.css.src + '/**/*.s+(a|c)ss'])
        .pipe(plumber())
        .pipe(cached('styles'))
        .pipe(postcss([
            require('stylelint'),
            require('postcss-reporter')({ clearAllMessages: true })
        ], { syntax: scss }))
        .on('error', gutil.log);
});
