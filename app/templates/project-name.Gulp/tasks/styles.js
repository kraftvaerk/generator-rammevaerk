import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import colors from 'ansi-colors';
import log from 'fancy-log';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import config from '../config';
import autoprefixer from 'autoprefixer';
import postcssCssVars from 'postcss-css-variables';
import postcssAssets from 'postcss-assets';
import postcssImport from 'postcss-import';
import cssnano from 'cssnano';

const PLUMBER_OPTIONS = {
    errorHandler: function (err) {
        log(colors.bold(colors.red(err.messageFormatted)));
        this.emit('end');
    }
};

const SASS_OPTIONS = {
    includePaths: ['node_modules']
};

const SOURCEMAP_OPTIONS = {
    includeContent: false,
    sourceRoot: config.css.src
};

function processStyles() {
    const PROCESSORS = [
        autoprefixer,
        postcssCssVars,
        postcssAssets,
        postcssImport,
        ...(!global.isWatching) ? [cssnano({
            autoprefixer: false,
            discardDuplicates: false,
            orderedValues: false,
            svgo: false
        })] : []
    ];

    return gulp.src(`${config.css.src}/**/style.scss`)
        .pipe(plumber(PLUMBER_OPTIONS))
        .pipe(sourcemaps.init())
        .pipe(sass(SASS_OPTIONS))
        .pipe(postcss(PROCESSORS))
        .pipe(sourcemaps.write('./', SOURCEMAP_OPTIONS))
        .pipe(gulp.dest(config.css.dest))
        .on('error', log);
}

gulp.task('styles', processStyles);
