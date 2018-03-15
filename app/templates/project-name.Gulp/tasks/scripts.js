import gulp from 'gulp';
import del from 'del';
import log from 'fancy-log';
import webpack from 'webpack';
import config from '../config';
import webpackConfig from '../../webpack.config';

function webpackCallback(err, stats, done) {
    log('[webpack:build] Completed\n' + stats.toString({
        colors: true,
        modules: false,
        entrypoints: false
    }));

    done();
}

function cleanScripts(done) {
    return del(`${config.js.dest}/*.{js,map,LICENSE}`, done);
}

function processScripts(done) {
    webpack(webpackConfig, (err, stats) => webpackCallback(err, stats, done));
}

gulp.task('scripts', gulp.series(cleanScripts, processScripts));
