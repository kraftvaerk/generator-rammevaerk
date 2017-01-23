'use strict';

const production      = process.env.NODE_ENV === 'production' ? true : false;
const gulp            = require('gulp');
const imagemin        = require('gulp-imagemin');
const plumber         = require('gulp-plumber');
const clean           = require('gulp-rimraf');
const gutil           = require('gulp-util');
const conf            = require('../config');

gulp.task('images:clean', () => {
    return gulp.src(conf.css.dest + '/**/img/**/*.{jpg,png,gif,svg}', { read: false })
                .pipe(plumber())
                .pipe(clean({force: true}))
                .on('error', gutil.log);
});

// Copy and optimize images
gulp.task('images', ['images:clean'], () => {
    return gulp.src(conf.css.src + '/**/img/**/*.{jpg,png,gif,svg}')
                .pipe(plumber())
                .pipe(production ? imagemin({
                    progressive: true
                }) : gutil.noop())
                .pipe(gulp.dest(conf.css.dest))
                .on('error', gutil.log);
});
