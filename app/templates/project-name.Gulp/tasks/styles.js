import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import gulp from 'gulp';
import gutil from 'gulp-util';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import postcssclear from 'postcss-clearfix';
import postcsstype from 'postcss-responsive-type';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import config from '../config';

function processStyles() {
    const processors = [
        autoprefixer,
        postcsstype,
        postcssclear
    ];

    if (!global.isWatching) {
        processors.push(cssnano({
            autoprefixer: false,
            discardDuplicates: false,
            orderedValues: false,
            svgo: false
        }));
    }

    return gulp.src(`${config.css.src}/**/screen.scss`)
        .pipe(plumber({
            errorHandler(err) {
                gutil.log(gutil.colors.bold.red(err.messageFormatted));
                gutil.beep();
                this.emit('end');
            }
        }))
        .pipe(global.production ? gutil.noop() : sourcemaps.init())
        .pipe(sass({ includePaths: ['node_modules'] }))
        .pipe(postcss(processors))
        .pipe(rename((path) => {
            path.basename = `${path.basename}.min`;
        }))
        .pipe(global.production ? gutil.noop() : sourcemaps.write('./', { includeContent: false, sourceRoot: config.css.src }))
        .pipe(gulp.dest(config.css.dest))
        .on('error', gutil.log);
}

gulp.task('styles', processStyles);
