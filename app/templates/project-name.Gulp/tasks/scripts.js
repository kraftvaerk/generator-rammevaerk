import del from 'del';
import gulp from 'gulp';
import log from 'fancy-log';
import webpack from 'webpack';
import config from '../config';
import webpackConfig from '../../webpack.config';

const compiler = webpack(webpackConfig);

function logStats(error, stats, done) {
    if (error) {
        console.error(error);
        return;
    }

    log('[webpack:build] Completed\n' + stats.toString({
        colors: true,
        modules: false
    }));

    done();
}

function processScripts(done) {
    compiler.run((error, stats) => {
        logStats(error, stats, done);
    });
}

export function watchScripts(done) {
    compiler.watch(null, (error, stats) => {
        logStats(error, stats, done);
    });
}

function cleanScripts(done) {
    return del(`${config.js.dest}/*.{js,map,LICENSE}`, done);
}

gulp.task('scripts', gulp.series(cleanScripts, processScripts));
