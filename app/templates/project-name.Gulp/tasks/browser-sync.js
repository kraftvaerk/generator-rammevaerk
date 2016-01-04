'use strict';

const gulp            = require('gulp-help')(require('gulp'));
const browserSync     = require('browser-sync');
const conf            = require('../config');

gulp.task('server', false, ['default'], () => {
    browserSync({
        logPrefix: conf.pkg.name,
        server: {
            baseDir: conf.baseDir
        },
        startPath: './mockup/index.html',
        index: 'index.html',
        open: true,
        directory: true,
        ghostMode: {
            click: true,
            forms: true,
            scroll: true
        }
    });
});
