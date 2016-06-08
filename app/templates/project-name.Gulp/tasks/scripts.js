'use strict';

const gulp            = require('gulp-help')(require('gulp'));
const eslint          = require('gulp-eslint');
const plumber         = require('gulp-plumber');
const gutil           = require('gulp-util');
const jspm            = require('gulp-jspm');
const sourcemaps      = require('gulp-sourcemaps');
const rename          = require('gulp-rename');
const fs              = require('fs');
const conf            = require('../config');

gulp.task('scripts', 'Generate solution script', [<% if (linting.scripts){ %>'scripts:lint'<% } %>], () => {
    return gulp.src([conf.js.src + '/**/index.js', '!**/Shared/**', '!**/Vendor/**'])
                .pipe(plumber())
                .pipe(sourcemaps.init())
                .pipe(jspm({selfExecutingBundle: true, minify: true}))
                .pipe(sourcemaps.write('./', {includeContent: false, sourceRoot: conf.js.src}))
                .pipe(rename(function(path){
                    path.basename = 'common-bundle.min';
                }))
                .pipe(gulp.dest(conf.js.dest))
                .on('error', gutil.log);
});

<% if (linting.scripts){ %>gulp.task('scripts:lint', 'Lint all javascript files', () => {
    return gulp.src([conf.js.src + '/**/*.js', './*Gulp/**/*.js'])
                .pipe(plumber())
                .pipe(eslint())
                .pipe(eslint.format())
                .on('error', gutil.log);
});<% } %>

gulp.task('scripts:pathfix', false, () => {
    fs.readFile(`${conf.js.src}/system.config.js`, 'utf8', function (rErr, data) {
        if (rErr){
            throw rErr;
        }
        fs.writeFile(`${conf.js.src}/system.config.js`, data.replace(/<%= answers.projectName %>.Web\//g, ''), function(wErr) {
            if (wErr){
                throw wErr;
            }
            console.log('Systemjs vendor pathfix');
        });
    });
});
