import gulp from "gulp";
import HubRegistry from 'gulp-hub';

import server from './<%= answers.projectName %>.Gulp/tasks/browser-sync.js';
import watcher from './<%= answers.projectName %>.Gulp/tasks/watch.js';

global.production = process.env.NODE_ENV === 'production';

// Load some files into the registry
const hub = new HubRegistry(['./<%= answers.projectName %>.Gulp/tasks/*.js']);

// Tell gulp to use the tasks just loaded
gulp.registry(hub);

const tasks = [
    'scripts',
    'styles',
    'images'
];

if (!production) {
    tasks.push('html', 'scripts:lint', 'styles:lint');
}

gulp.task('default', gulp.parallel(tasks));
gulp.task('server', gulp.series('default', server.serve));
gulp.task('watch', gulp.series('watch:flag', 'server', watcher.watch));
