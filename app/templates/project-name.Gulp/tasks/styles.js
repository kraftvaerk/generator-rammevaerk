import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import plumber from 'gulp-plumber';
import gutil from 'gulp-util';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import config from '../config';
import autoprefixer from 'autoprefixer';
import postcsstype from 'postcss-responsive-type';
import postcssclear from 'postcss-clearfix';
import cssnano from 'cssnano';

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

    return gulp.src([config.css.src + '/**/' + 'screen.scss'])
        .pipe(plumber({
            errorHandler: function (err) {
                gutil.log('Filename: ', gutil.colors.bold.red(err.file));
                gutil.log('Linenumber: ', gutil.colors.bold.red(err.line));
                gutil.log('Extract: ', gutil.colors.bold.red(err.message));
                gutil.beep();
                this.emit('end');
            }
        }))
        .pipe(global.production ? gutil.noop() : sourcemaps.init())
        .pipe(sass({includePaths: ['node_modules']}))
        .pipe(postcss(processors))
        .pipe(rename(function(path){
            path.basename = path.basename + '.min';
        }))
        .pipe(global.production ? gutil.noop() : sourcemaps.write('./', {includeContent: false, sourceRoot: config.css.src}))
        .pipe(gulp.dest(config.css.dest))
        .on('error', gutil.log);
}

gulp.task('styles', processStyles);
