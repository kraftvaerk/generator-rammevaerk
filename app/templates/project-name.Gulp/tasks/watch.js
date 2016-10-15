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

    /* eslint no-new: 0*/
    new FONTS({
        'text': conf.pkg.name, // text to be converted
        'font': 'simple', // define the font face
        'letterSpacing': 0, // define letter spacing
        'space': false, // define if the output text should have empty lines on top and on the bottom
        'maxLength': '20' // define how many character can be on one line
    });

    watch([conf.css.src + '/**/*.{jpg,png,gif,svg}', '!' + conf.css.src + '/**/svg/*'], function(){
        browserSync.notify('Images updating!');
        gulp.start('images', 'svg', function(){
            browserSync.reload();
        });
    });

    watch([conf.css.src + '/**/*.scss'], function(){
        browserSync.notify('Styles updating!');

        gulp.start([<% if (linting.styles){ %>'styles:lint',<% } %> 'styles'], function(){
            browserSync.reload('*.css');
        });
    });

    watch(conf.js.src + '/**/*.js', function(file){
        let scriptTask = 'module';

        if (file.path.match('core.js')){
            scriptTask = 'bundle';
        } else if (file.path.match('system.config.js')){
            scriptTask = 'config';
        }

        browserSync.notify('Scripts updating!');
        gulp.start([<% if (linting.scripts){ %>'scripts:lint',<% } %> 'scripts:' + scriptTask], function(){
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
