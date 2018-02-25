import gulp from 'gulp';
import eslint from 'gulp-eslint';
import plumber from 'gulp-plumber';
import log from 'fancy-log';
import cached from 'gulp-cached';
import { obj as noop } from 'through2';
import config from '../config';

function scriptsLint() {
    return gulp.src([`${config.js.src}/**/*.js`, './*Gulp/**/*.js'])
        .pipe(global.isWatching ? cached('scripts') : noop())
        .pipe(plumber())
        .pipe(eslint())
        .pipe(eslint.format())
        .on('error', log);
}

gulp.task('scripts:lint', scriptsLint);
