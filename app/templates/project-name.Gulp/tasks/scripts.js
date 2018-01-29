import gulp from 'gulp';
import del from 'del';
import gutil from 'gulp-util';
import webpack from 'webpack';
import config from '../config';
import webpackConfig from '../../webpack.config';

function cleanScripts(done) {
    return del([config.js.dest + '/*.{js,map,LICENSE}'], done);
}

function processScripts(done) {
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

        done();
    });
}

gulp.task('scripts', gulp.series(cleanScripts, processScripts));
