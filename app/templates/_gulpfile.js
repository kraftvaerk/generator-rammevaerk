import gulp from "gulp";
import images from './<%= answers.projectName %>.Gulp/tasks/images.js';
import styles from './<%= answers.projectName %>.Gulp/tasks/styles.js';
import scripts from './<%= answers.projectName %>.Gulp/tasks/scripts.js';
import html from './<%= answers.projectName %>.Gulp/tasks/html.js';
import stylesLint from './<%= answers.projectName %>.Gulp/tasks/styles-lint.js';
import scriptsLint from './<%= answers.projectName %>.Gulp/tasks/scripts-lint.js';
import watch from './<%= answers.projectName %>.Gulp/tasks/watch.js';
import server from './<%= answers.projectName %>.Gulp/tasks/browser-sync.js';

const production = process.env.NODE_ENV === 'production';

const tasks = [
    'scripts',
    'styles',
    'images'
];

gulp.task('images:clean', images.cleanImages);
gulp.task('images', gulp.series('images:clean', images.processImages));
gulp.task('styles', styles.processStyles);

gulp.task('scripts:clean', scripts.cleanScripts);
gulp.task('scripts', gulp.series('scripts:clean', scripts.processScripts));

if (!production){
    tasks.push('html');
    tasks.push('scripts:lint');
    tasks.push('styles:lint');

    gulp.task('html', html.processHTML);
    gulp.task('styles:lint', stylesLint.processStylesLint);
    gulp.task('scripts:lint', scriptsLint.processScriptsLint);
    gulp.task('default', gulp.parallel(tasks));
    gulp.task('server', gulp.series('default', server.startServer));
    gulp.task('watch:flag', (done) => {
        global.isWatching = true;
        done();
    });

    gulp.task('watch', gulp.series('watch:flag', 'server', watch.startWatchers));
}else {
    gulp.task('default', gulp.parallel(tasks));
}
