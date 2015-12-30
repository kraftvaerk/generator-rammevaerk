'use strict';

const fs              = require('fs');
const path            = require('path');
const gulp            = require('gulp-help')(require('gulp'));
const plumber         = require('gulp-plumber');
const gulpFilter      = require('gulp-filter');
const flatten         = require('gulp-flatten');
const svgSprite       = require('gulp-svg-sprite');
const gutil           = require('gulp-util');
const conf            = require('../config');

/** Plumber error function */
const onError = function (err) {
    gutil.beep();
    console.log(err);
    this.emit('end');
};

/** Returns an array of folders inside the provided folder */
const getFolders = function(dir) {
    return fs.readdirSync(dir)
            .filter(function(file) {
                return fs.statSync(path.join(dir, file)).isDirectory();
            });
};

/**
 * Generates svg symbol mapping based on brand
 * @param  {string} brandFolder path to folder
 * @return {stream}
 */
const getGenerateTask = function (brandFolder) {
    /** If sprite maps are needed, use the config below that is commented out */
    /** const config = { shape: { spacing: { padding: 10 } }, mode: { symbol: true, view: { render: { scss: true } } }}; */
    const config = {
        mode: {
            symbol: true
        }
    };
    const svgFilter = gulpFilter(['**/*.svg'], {restore: true});
    const scssFilter = gulpFilter(['**/*.scss'], {restore: true});

    return gulp.src(conf.css.src + '/' + brandFolder + '/img/**/*.svg', {cwd: '.'})
                .pipe(plumber({ errorHandler: onError }))
                .pipe(svgSprite(config))
                .pipe(flatten())
                .pipe(svgFilter)
                .pipe(gulp.dest(conf.css.src + '/' + brandFolder + '/svg'))
                .pipe(svgFilter.restore)
                .pipe(scssFilter)
                .pipe(gulp.dest(conf.css.src + '/' + brandFolder));
};

/**
 * Copies generated svgs to dest folder based on brand
 * @param  {string} brandFolder brand name
 * @return {stream}
 */
const getCopyTask = function (brandFolder) {
    return gulp.src(conf.css.src + '/' + brandFolder + '/svg/**/*.svg')
                .pipe(plumber({ errorHandler: onError }))
                .pipe(gulp.dest(conf.css.dest + '/' + brandFolder + '/svg'))
                .on('error', gutil.log);
};

/** Retrieves current brand if any is set, otherwise it returns false */
const getBrand = () => {
    let brand = false;

    if(global.isBrand && global.isBrand !== 'Shared'){
        brand = global.isBrand;
    }else {
        brand = false;
    }

    return brand;
};

/** Generates svg synbol mapping */
gulp.task('svg:generate', 'Create SVG symbol mapping', () => {
    const brand = getBrand();

    /** If a brand is not selected it means we are running the default task which should generate symbols for all brands */
    if (!brand) {
        const folders = getFolders(conf.css.src);
        const tasks = folders.map(function(folderName) {
            if (folderName === 'Shared' || folderName === 'shared') {
                return true;
            }

            return getGenerateTask(folderName);
        });

        return tasks;
    }

    /** If a brand is selected, the task is run via the watcher and we only need to generate the symbol for a specific brand */
    return getGenerateTask(brand);
});

/** Copies generated svg symbol mapping to dest folder */
gulp.task('svg', 'Copy symnbol svg to dest folder', ['svg:generate'], () => {
    const brand = getBrand();

    /** If a brand is not selected it means we are running the default task which should generate symbols for all brands */
    if (!brand) {
        const folders = getFolders(conf.css.src);
        const tasks = folders.map(function(folderName) {
            if (folderName === 'Shared' || folderName === 'shared') {
                return true;
            }

            return getCopyTask(folderName);
        });

        return tasks;
    }

    return getCopyTask(brand);
});
