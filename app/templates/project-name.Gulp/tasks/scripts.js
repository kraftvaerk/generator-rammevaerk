'use strict';

const del             = require('del');
const gulp            = require('gulp');
const gutil           = require('gulp-util');
const webpack         = require('webpack');
const conf            = require('../config');
const webpackConfig   = require('../../webpack.config');

gulp.task('scripts:clean', () => {
    return del([conf.js.dest + '/*.{js,map,LICENSE}']);
});

gulp.task('scripts', ['scripts:clean'], (callback) => {
    webpack(webpackConfig, (err, stats) => {
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
