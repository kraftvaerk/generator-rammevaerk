'use strict';

const gulp            = require('gulp');
const watch           = require('gulp-watch');
const browserSync     = require('browser-sync');
const conf            = require('../config');

gulp.task('watch:flag', false, () => {
    global.isWatching = true;
});

// Watches for source changes to preform tasks with livereloading browser
gulp.task('watch', ['watch:flag', 'server'], function(){
    const FONTS = require('cfonts');

    FONTS.say( conf.pkg.name, {
        'font': 'simple', // define the font face
        'letterSpacing': 0, // define letter spacing
        'space': false, // define if the output text should have empty lines on top and on the bottom
        'maxLength': '20' // define how many character can be on one line
    });

    watch([conf.css.src + '/**/*.scss'], function(){
        browserSync.notify('Styles updating!');

        gulp.start(['styles:lint', 'styles'], function(){
            browserSync.reload('*.css');
        });
    });

    watch(conf.js.src + '/**/*.js', function(){
        browserSync.notify('Scripts updating!');
        gulp.start(['scripts'], function(){
            browserSync.reload('*.js');
        });
    });

    watch(conf.html.src + '/**/*.pug', function(file){
        browserSync.notify('HTML updating!');
        global.isInclude = /includes/.test(file.relative);
        gulp.start('html', function(){
            browserSync.reload();
        });
    });
});
