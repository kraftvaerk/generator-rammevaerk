import del from 'del';
import gulp from 'gulp';
import gutil from 'gulp-util';
import plumber from 'gulp-plumber';
import conf from '../config';

function processImages() {
    return gulp.src(conf.css.src + '/**/img/**/*.{jpg,png,gif,svg}')
        .pipe(plumber())
        .pipe(gulp.dest(conf.css.dest))
        .on('error', gutil.log);
}

function cleanImages(done) {
    return del([conf.css.dest + '/**/img/**/*.{jpg,png,gif,svg}'], done);
}

export default {
    processImages,
    cleanImages
};
