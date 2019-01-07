import browserSync from 'browser-sync';
import cfonts from 'cfonts';
import gulp from 'gulp';
import { watchScripts } from './scripts';
import config from '../config';

function watch() {
    cfonts.say(config.pkg.name, {
        font: 'simple',
        letterSpacing: 0,
        space: false,
        maxLength: '20'
    });

    gulp.watch(`${config.css.src}/**/*.scss`).on('change', () => {
        browserSync.notify('Styles updating!');

        gulp.series('styles:lint', 'styles')(() => {
            browserSync.reload('*.css');
        });
    });

    gulp.watch(`${config.html.src}/**/*.pug`).on('change', (path) => {
        browserSync.notify('HTML updating!');
        global.isInclude = /includes/.test(path);
        gulp.series('html')(() => {
            browserSync.reload();
        });
    });

    watchScripts(() => {
        browserSync.notify('Scripts updating!');
        browserSync.reload();
    });
}

gulp.task('watch:flag', (done) => {
    global.isWatching = true;
    done();
});

export default {
    watch
};
