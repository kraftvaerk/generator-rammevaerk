'use strict';

const gulp            = require('gulp-help')(require('gulp'));
const jade            = require('gulp-jade');
const rename          = require('gulp-rename');
const plumber         = require('gulp-plumber');
const changed         = require('gulp-changed');
const cached          = require('gulp-cached');
const gulpif          = require('gulp-if');
const gutil           = require('gulp-util');
const conf            = require('../config');

gulp.task('html', 'Convert jade into html for mockup', () => {
    return gulp.src(conf.html.src + '**/*.jade')
                .pipe(plumber())
                .pipe(gulpif((global.isWatching && !global.isInclude), changed(conf.html.dest, {extension: '.html'})))
                .pipe(gulpif((global.isWatching && !global.isInclude), cached('jade')))
                .pipe(jade({
                    data: {
                        site: {
                            name: conf.pkg.name,
                            namespace: conf.namespace,
                            description: conf.pkg.description
                        }
                    },
                    pretty: true
                }))
                .pipe(rename(function(path){
                    path.dirname = '.';
                    if(path.basename !== 'index'){
                        path.basename = 'tpl-' + path.basename;
                    }
                }))
                .pipe(gulp.dest(conf.html.dest))
                .on('error', gutil.log);
});
