import gulp from 'gulp';
import pug from 'gulp-pug';
import plumber from 'gulp-plumber';
import changed from 'gulp-changed';
import cached from 'gulp-cached';
import colors from 'ansi-colors';
import log from 'fancy-log';
import { obj as throughObj } from 'through2';
import config from '../config';

const PUG_OPTIONS = {
    data: {
        site: {
            name: config.pkg.name,
            namespace: config.namespace,
            description: config.pkg.description
        }
    },
    pretty: true
};

const PLUMBER_OPTIONS = {
    errorHandler(err) {
        log('Filename: ', colors.bold(colors.red(err.filename)));
        log('Linenumber: ', colors.bold(colors.red(err.line)));
        log('Extract: ', colors.bold(colors.red(err.msg)));
        this.emit('end');
    }
};

function templatePath(file, encoding, cb) {
    file.path = file.path.replace('pug', '');
    cb(null, file);
}

function processHTML(){
    return gulp.src([`${config.html.src}/**/*.pug`, '!**/includes/*.pug'])
        .pipe(plumber(PLUMBER_OPTIONS))
        .pipe(changed((file) => file.path.replace('/pug', ''), { extension: '.html' }))
        .pipe((global.isWatching && !global.isInclude) ? cached('pug') : throughObj())
        .pipe(pug(PUG_OPTIONS))
        .pipe(throughObj(templatePath))
        .pipe(gulp.dest(config.html.dest))
        .on('error', log);
}

gulp.task('html', processHTML);
