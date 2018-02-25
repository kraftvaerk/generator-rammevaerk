import gulp from 'gulp';
import cached from 'gulp-cached';
import plumber from 'gulp-plumber';
import log from 'fancy-log';
import postcss from 'gulp-postcss';
import scss from 'postcss-scss';
import stylelint from 'stylelint';
import postcssReporter from 'postcss-reporter';
import { obj as noop } from 'through2';
import config from '../config';

function stylesLint() {
    return gulp.src(`${config.css.src}/**/*.s+(a|c)ss`)
        .pipe(plumber())
        .pipe(global.isWatching ? cached('styles') : noop())
        .pipe(postcss([
            stylelint,
            postcssReporter({ clearAllMessages: true })
        ], { syntax: scss }))
        .on('error', log);
}

gulp.task('styles:lint', stylesLint);
