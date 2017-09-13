'use strict';

const gulp            = require('gulp');
const webpack         = require('webpack');
const gutil           = require('gulp-util');
const webpackConfig   = require('../../webpack.config');

gulp.task('scripts', function(callback) {
    webpack(webpackConfig, function(err, stats) {
        if (err){
            throw new gutil.PluginError('webpack', err);
        }

        gutil.log('[webpack:build] Completed\n' + stats.toString({
            assets: true,
            chunks: false,
            chunkModules: false,
            colors: true,
            hash: false,
            timings: false,
            version: false
        }));

        callback();
    });
});
