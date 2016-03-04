'use strict';

const gulp            = require('gulp-help')(require('gulp'));
const eslint          = require('gulp-eslint');
const plumber         = require('gulp-plumber');
const gutil           = require('gulp-util');
const Builder         = require('systemjs-builder');
const fs              = require('fs');
const path            = require('path');
const conf            = require('../config');

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}

gulp.task('scripts', 'Generate solution script', [<% if (linting.scripts){ %>'scripts:lint'<% } %>], () => {
    global.isBrand = global.isBrand && global.isBrand !== 'system.config.js' ? global.isBrand : 'Shared';

    const brands = (global.isBrand && global.isBrand !== 'Shared') ? global.isBrand.split() : getDirectories(conf.js.src).filter((dir) => (!(dir === 'Vendor' || dir === 'Shared')));
    const builder = new Builder(conf.baseDir, `${conf.js.src}/system.config.js`);

    return brands.forEach((brand)=> {
        builder.buildStatic(`${conf.js.src}/${brand}/index`, `${conf.js.dest}/${brand.toLowerCase()}.bundle.js`, { minify: true, sourceMaps: true})
        .then(()=>{})
        .catch((err)=>{
            gutil.log(gutil.colors.bold.red(err));
        });
    });
});

<% if (linting.scripts){ %>gulp.task('scripts:lint', 'Lint all javascript files', () => {
    return gulp.src([conf.js.src + '/**/*.js', './<%= answers.projectName %>.Gulp/**/*.js', '!' + conf.js.src + '/Vendor/**/*'])
                .pipe(plumber())
                .pipe(eslint())
                .pipe(eslint.format())
                .on('error', gutil.log);
});<% } %>


gulp.task('scripts:pathfix', false, () => {
    fs.readFile(`${conf.js.src}/system.config.js`, 'utf8', function (rErr, data) {
        if (rErr){
            throw rErr;
        }
        fs.writeFile(`${conf.js.src}/system.config.js`, data.replace(/<%= answers.projectName %>.Web\//g, ''), function(wErr) {
            if (wErr){
                throw wErr;
            }
            console.log('Systemjs vendor pathfix');
        });
    });
});
