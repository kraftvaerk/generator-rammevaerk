import gulp from 'gulp';
import browserSync from 'browser-sync';
import cfonts from 'cfonts';
import config from '../config';

function watch() {
    cfonts.say( config.pkg.name, {
        'font': 'simple',
        'letterSpacing': 0,
        'space': false,
        'maxLength': '20'
    });

    gulp.watch(config.css.src + '/**/*.scss').on('change', function() {
        browserSync.notify('Styles updating!');

        gulp.series('styles:lint', 'styles')(function(){
            browserSync.reload('*.css');
        });
    });

    gulp.watch(config.js.src + '/**/*.js').on('change', function() {
        browserSync.notify('Scripts updating!');

        gulp.series('scripts:lint', 'scripts')(function(){
            browserSync.reload('*.js');
        });
    });

    gulp.watch(config.html.src + '/**/*.pug').on('change', function(path) {
        browserSync.notify('HTML updating!');
        global.isInclude = /includes/.test(path);
        gulp.series('html')(function(){
            browserSync.reload();
        });
    });
}

gulp.task('watch:flag', (done) => {
    global.isWatching = true;
    done();
});

export default {
    watch
};
