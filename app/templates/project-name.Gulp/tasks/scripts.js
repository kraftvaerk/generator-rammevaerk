'use strict';

const production      = process.env.NODE_ENV === 'production' ? true : false;
const gulp            = require('gulp');
const plumber         = require('gulp-plumber');
const gutil           = require('gulp-util');
const babel           = require('gulp-babel');
const jspm            = require('gulp-jspm');
const changed         = require('gulp-changed');
const sourcemaps      = require('gulp-sourcemaps');
const replace         = require('gulp-replace');
const conf            = require('../config');

// Generate all scripts
gulp.task('scripts', ['scripts:config', 'scripts:module', 'scripts:bundle']);

// Generate module scripts config
gulp.task('scripts:config', () => {
    return gulp.src([conf.js.src + '/**/system.config.js'])
                .pipe(plumber())
                .pipe(production ? gutil.noop() : sourcemaps.init())
                .pipe(babel())
                .pipe(production ? gutil.noop() : sourcemaps.write('.'))
                .pipe(replace('Content/Vendor/', 'Vendor/'))
                .pipe(replace('});', conf.systemjsHooks))
                .pipe(gulp.dest(conf.js.dest))
                .on('error', gutil.log);
});

// Generate module scripts
gulp.task('scripts:module', () => {
    return gulp.src([conf.js.src + '/**/*.js', '!/**/+(.c|c)ore.js', '!**/Vendor/**', '!/**/system.config.js'])
                .pipe(changed(conf.js.dest))
                .pipe(plumber())
                .pipe(production ? gutil.noop() : sourcemaps.init())
                .pipe(babel({'plugins': ['transform-es2015-modules-systemjs']}))
                .pipe(production ? gutil.noop() : sourcemaps.write('.'))
                .pipe(gulp.dest(conf.js.dest))
                .on('error', gutil.log);
});

// Generate script bundles
gulp.task('scripts:bundle', () => {
    return gulp.src([conf.js.src + '/**/+(.c|c)ore.js', '!**/Shared/**', '!**/Vendor/**', '!/EG/ng/**', '!/**/system.config.js'])
                .pipe(changed(conf.js.dest, {extension: '.bundle.js'}))
                .pipe(plumber())
                .pipe(production ? gutil.noop() : sourcemaps.init())
                .pipe(jspm({selfExecutingBundle: false, minify: true}))
                .pipe(production ? gutil.noop() : sourcemaps.write('./', {includeContent: false, sourceRoot: conf.js.src}))
                .pipe(gulp.dest(conf.js.dest))
                .on('error', gutil.log);
});
