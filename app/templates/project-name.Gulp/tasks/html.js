'use strict';

const gulp            = require('gulp');
const pug             = require('gulp-pug');
const rename          = require('gulp-rename');
const plumber         = require('gulp-plumber');
const changed         = require('gulp-changed');
const cached          = require('gulp-cached');
const gulpif          = require('gulp-if');
const gutil           = require('gulp-util');
const conf            = require('../config');

// Convert pug into html for mockup
gulp.task('html', () => {
    return gulp.src([conf.html.src + '/**/*.pug', '!**/includes/*.pug'])
                .pipe(plumber({
                    errorHandler: function (err) {
                        gutil.log('Filename: ', gutil.colors.bold.red(err.file));
                        gutil.log('Linenumber: ', gutil.colors.bold.red(err.line));
                        gutil.log('Extract: ', gutil.colors.bold.red(err.message));
                        gutil.beep();
                        this.emit('end');
                    }
                }))
                .pipe(gulpif((true), changed((file) => {
                    return file.path.replace('/pug', '');
                }, {extension: '.html'})))
                .pipe(gulpif((global.isWatching && !global.isInclude), cached('pug')))
                .pipe(pug({
                    data: {
                        site: {
                            name: conf.pkg.name,
                            namespace: conf.namespace,
                            description: conf.pkg.description
                        }
                    },
                    pretty: true
                }))
                .pipe(rename((path) => {
                    if (!(/includes/.test(path.dirname))){
                        path.dirname = path.dirname.replace('pug', '');

                        if (path.basename !== 'index'){
                            path.basename = 'tpl-' + path.basename;
                        }
                    } else {
                        return;
                    }
                }))
                .pipe(gulp.dest(conf.html.dest))
                .on('error', gutil.log);
});
