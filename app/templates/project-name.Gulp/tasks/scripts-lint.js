import gulp from 'gulp';
import eslint from 'gulp-eslint';
import plumber from 'gulp-plumber';
import gutil from 'gulp-util';
import cached from 'gulp-cached';
import config from '../config';

function scriptsLint() {
    return gulp.src([config.js.src + '/**/*.js', './*Gulp/**/*.js'])
        .pipe(global.isWatching ? cached('scripts') : gutil.noop())
        .pipe(plumber())
        .pipe(eslint())
        .pipe(eslint.format())
        .on('error', gutil.log);
}

gulp.task('scripts:lint', scriptsLint);
