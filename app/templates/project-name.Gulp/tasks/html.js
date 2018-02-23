import cached from 'gulp-cached';
import changed from 'gulp-changed';
import gulp from 'gulp';
import gutil from 'gulp-util';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';
import rename from 'gulp-rename';
import config from '../config';

function processHTML() {
    return gulp.src([`${config.html.src}/**/*.pug`, '!**/includes/*.pug'])
        .pipe(plumber({
            errorHandler(err) {
                gutil.log('Filename: ', gutil.colors.bold.red(err.filename));
                gutil.log('Linenumber: ', gutil.colors.bold.red(err.line));
                gutil.log('Extract: ', gutil.colors.bold.red(err.msg));
                gutil.beep();
                this.emit('end');
            }
        }))
        .pipe(changed((file) => {
            return file.path.replace('/pug', '');
        }, { extension: '.html' }))
        .pipe((global.isWatching && !global.isInclude) ? cached('pug') : gutil.noop())
        .pipe(pug({
            data: {
                site: {
                    name: config.pkg.name,
                    namespace: config.namespace,
                    description: config.pkg.description
                }
            },
            pretty: true
        }))
        .pipe(rename((path) => {
            if (/includes/.test(path.dirname)) {
                return;
            }

            path.dirname = path.dirname.replace('pug', '');

            if (path.basename !== 'index') {
                path.basename = `tpl-${path.basename}`;
            }
        }))
        .pipe(gulp.dest(config.html.dest))
        .on('error', gutil.log);
}

gulp.task('html', processHTML);
