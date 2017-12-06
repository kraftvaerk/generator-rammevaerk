'use strict';

const gulp            = require('gulp');
const plumber         = require('gulp-plumber');
const clean           = require('gulp-rimraf');
const webpack         = require('webpack');
const gutil           = require('gulp-util');
const conf            = require('../config');
const webpackConfig   = require('../../webpack.config');

gulp.task('scripts:clean', () => {
    return gulp.src(conf.js.dest + '/*.{js,map,LICENSE}', { read: false })
        .pipe(plumber())
        .pipe(clean({force: true}))
        .on('error', gutil.log);
});

gulp.task('scripts', ['scripts:clean'], function(callback) {
    webpack(webpackConfig, function(err, stats) {
        if (err){
            throw new gutil.PluginError('webpack', err);
        }

        gutil.log('[webpack:build] Completed\n' + stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }));

        callback();
    });
});
