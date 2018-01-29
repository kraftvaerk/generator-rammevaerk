import browserSync from 'browser-sync';
import gutil from 'gulp-util';
import conf from '../config';

function startServer(done) {
    browserSync({
        logPrefix: gutil.colors.bold.white(conf.pkg.name.toUpperCase()),
        server: {
            baseDir: conf.baseDir
        },
        startPath: './Mockup/<%= answers.projectName %>/index.html',
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
    startServer
};
