import browserSync from 'browser-sync';
import gutil from 'gulp-util';
import config from '../config';

function serve(done) {
    browserSync({
        logPrefix: gutil.colors.bold.white(config.pkg.name.toUpperCase()),
        server: {
            baseDir: config.baseDir
        },
        startPath: `./Mockup/${config.pkg.name}/index.html`,
        index: 'index.html',
        open: true,
        directory: true,
        ghostMode: {
            click: true,
            forms: true,
            scroll: true
        },
        online: true
    });

    done();
}

export default {
    serve
};
