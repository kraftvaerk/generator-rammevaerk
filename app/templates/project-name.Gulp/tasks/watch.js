import gulp from 'gulp';
import browserSync from 'browser-sync';
import conf from '../config';
import FONTS from 'cfonts';

function startWatchers() {
    FONTS.say( conf.pkg.name, {
        'font': 'simple', // define the font face
        'letterSpacing': 0, // define letter spacing
        'space': false, // define if the output text should have empty lines on top and on the bottom
        'maxLength': '20' // define how many character can be on one line
    });

    gulp.watch(conf.css.src + '/**/*.scss').on('change', function() {
        browserSync.notify('Styles updating!');

        gulp.series('styles:lint', 'styles')(function(){
            browserSync.reload('*.css');
        });
    });

    gulp.watch(conf.js.src + '/**/*.js').on('change', function() {
        browserSync.notify('Scripts updating!');

        gulp.series('scripts')(function(){
            browserSync.reload('*.js');
        });
    });

    gulp.watch(conf.html.src + '/**/*.pug').on('change', function(path) {
        browserSync.notify('HTML updating!');
        global.isInclude = /includes/.test(path);
        gulp.series('html')(function(){
            browserSync.reload();
        });
    });
}

export default {
    startWatchers
};
