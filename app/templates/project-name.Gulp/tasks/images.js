'use strict';

const del             = require('del');
const gulp            = require('gulp');
const gutil           = require('gulp-util');
const plumber         = require('gulp-plumber');
const conf            = require('../config');

gulp.task('images:clean', () => {
    return del([conf.css.dest + '/**/img/**/*.{jpg,png,gif,svg}']);
});

// Copy and optimize images
gulp.task('images', ['images:clean'], () => {
    return gulp.src(conf.css.src + '/**/img/**/*.{jpg,png,gif,svg}')
        .pipe(plumber())
        .pipe(gulp.dest(conf.css.dest))
        .on('error', gutil.log);
});
