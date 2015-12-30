'use strict';

const gulp            = require('gulp-help')(require('gulp'));
const imagemin        = require('gulp-imagemin');
const plumber         = require('gulp-plumber');
const clean           = require('gulp-rimraf');
const gutil           = require('gulp-util');
const conf            = require('../config');

const getBrand = () => {
    let brand = '';

    if(global.isBrand && global.isBrand !== 'Shared'){
        brand = '/' + global.isBrand;
    }else {
        brand = '/**';
    }

    return brand;
};

gulp.task('images:clean', false, () => {
    const brand = getBrand();

    return gulp.src(conf.css.dest + brand + '/img/**/*.{jpg,png,gif,svg}', { read: false })
                .pipe(plumber())
                .pipe(clean({force: true}))
                .on('error', gutil.log);
});


gulp.task('images', 'Copy and optimize images', ['images:clean'], () => {
    const brand = getBrand();

    return gulp.src(conf.css.src + brand + '/img/**/*.{jpg,png,gif,svg}')
                .pipe(plumber())
                .pipe(imagemin({
                    progressive: true
                }))
                .pipe(gulp.dest(conf.css.dest + (brand === '/**' ? '' : (brand + '/img'))))
                .on('error', gutil.log);
});
