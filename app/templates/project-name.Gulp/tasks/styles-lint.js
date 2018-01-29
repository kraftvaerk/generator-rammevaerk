import gulp from 'gulp';
import cached from 'gulp-cached';
import plumber from 'gulp-plumber';
import gutil from 'gulp-util';
import postcss from 'gulp-postcss';
import scss from 'postcss-scss';
import conf from '../config';

function processStylesLint() {
    return gulp.src([conf.css.src + '/**/*.s+(a|c)ss'])
        .pipe(plumber())
        .pipe(cached('styles'))
        .pipe(postcss([
            require('stylelint'),
            require('postcss-reporter')({ clearAllMessages: true })
        ], { syntax: scss }))
        .on('error', gutil.log);
}

export default {
    processStylesLint
};
