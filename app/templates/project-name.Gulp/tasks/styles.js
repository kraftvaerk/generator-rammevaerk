'use strict';

const gulp            = require('gulp-help')(require('gulp'));
const sourcemaps      = require('gulp-sourcemaps');
const rename          = require('gulp-rename');
const plumber         = require('gulp-plumber');
const gutil           = require('gulp-util');
const sass            = require('gulp-sass');
const postcss         = require('gulp-postcss');
const scss            = require("postcss-scss");
const conf            = require('../config');


<% if (linting.styles){ %>gulp.task('styles:lint', 'Lint all style files', () => {
    return gulp.src([conf.css.src + '/**/*.s+(a|c)ss', '!' + conf.css.src + '/Shared/Vendor/**/*'])
                .pipe(plumber())
                .pipe(postcss([
                    require('stylelint'),
                    require('postcss-reporter')({ clearMessages: true })
                ], { syntax: scss }))
                .on('error', gutil.log);
});<% } %>

gulp.task('styles', 'Generate solution styles', [<% if (linting.styles){ %>'styles:lint'<% } %>], () => {
    const processors = [
        require('lost'),
        require('autoprefixer')({browsers: conf.browserSupport}),
        require('cssnano'),
        require('pixrem'),
        require('postcss-responsive-type'),
        require('postcss-clearfix')
    ];

    return gulp.src(conf.css.src + '/**/' + 'screen.scss')
                .pipe(plumber({
                    errorHandler: function (err) {
                        gutil.log('Filename: ', gutil.colors.bold.red(err.file));
                        gutil.log('Linenumber: ', gutil.colors.bold.red(err.line));
                        gutil.log('Extract: ', gutil.colors.bold.red(err.message));
                        gutil.beep();
                        this.emit('end');
                    }
                }))
                .pipe(sourcemaps.init())
                .pipe(sass())
                .pipe(postcss(processors))
                .pipe(rename(function(path){
                    path.basename = path.basename + '.min';
                }))
                .pipe(sourcemaps.write('./', {includeContent: false, sourceRoot: conf.css.src}))
                .pipe(gulp.dest(conf.css.dest))
                .on('error', gutil.log);
});
