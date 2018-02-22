import pkg        from '../package.json';
const baseDir     = './<%= answers.projectName %>.Website';

export default {
    pkg: pkg,
    baseDir: baseDir,
    html: {
        dest: `${baseDir}/Mockup`,
        src: `${baseDir}/Mockup`
    },
    js: {
        dest: `${baseDir}/Content/Scripts`,
        src: `${baseDir}/Scripts`
    },
    css: {
        dest: `${baseDir}/Content/Styles`,
        src: `${baseDir}/Styles`
    }
};
