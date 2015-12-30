'use strict';

const gulp            = require('gulp-help')(require('gulp'));
const gutil           = require('gulp-util');
const parker          = require('gulp-parker');
const psi             = require('psi');
const ngrok           = require('ngrok');
const conf            = require('../config');

let site;
gulp.task('insight:ngrok-url', false, (cb) => {
    return ngrok.connect(3000, function (err, url) {
        // console.log('serving your tunnel from: ' + url);
        site = url;
        cb();
    });
});

/*eslint handle-callback-err: 0*/
gulp.task('insight:psi-desk', false, ['insight:ngrok-url'], (cb) => {
    return psi(site, {
        // key: key
        nokey: 'true',
        strategy: 'desktop'
    }, (err, data) => {
        if(!data){
            gutil.log('Error: ', gutil.colors.red(err));
            return;
        }
        gutil.log('=======================================');
        gutil.log('Site: ', gutil.colors.yellow(data.title + ' - ' + data.id));
        gutil.log('Score: ', gutil.colors.bold.green(data.score));

        for(const stat in data.pageStats){
            gutil.log(stat.split('')[0].toUpperCase() + stat.substr(1) + ': ', gutil.colors.cyan(data.pageStats[stat]));
        }

        gutil.log('=======================================');
        cb();

        /*eslint no-process-exit: 0*/
        process.exit();
    });
});

gulp.task('insight:parker', false, () => {
    return gulp.src(conf.css.dest + '/*.css')
        .pipe(parker({
            metrics: [
                'TotalRules',
                'TotalSelectors',
                'TotalIdentifiers',
                'TotalDeclarations',
                'TotalImportantKeywords',
                'TotalUniqueColours',
                'TotalMediaQueries',
                'MediaQueries'
            ]
        }));
});

gulp.task('insight', 'Page speed and stylesheet analysis', ['insight:parker', 'insight:psi-desk'], gutil.noop);
