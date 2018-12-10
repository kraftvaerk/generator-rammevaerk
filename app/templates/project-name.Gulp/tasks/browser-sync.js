import browserSync from 'browser-sync';
import colors from 'ansi-colors';
import config from '../config';

const BROWSERSYNC_OPTIONS = {
    logPrefix: colors.bold(colors.white(config.pkg.name.toUpperCase())),
    server: {
        baseDir: config.baseDir
    },
    startPath: `./Mockup/${config.pkg.name}/index.html`
};

function serve(done) {
    browserSync(BROWSERSYNC_OPTIONS);
    done();
}

export default {
    serve
};
