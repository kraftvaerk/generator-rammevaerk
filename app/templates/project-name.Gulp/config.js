'use strict';

const pkg         = require('../package.json');
const baseDir     = './<%= answers.projectName %>.Web';

module.exports = {
    pkg: pkg,

    namespace: 'st',

    baseDir: baseDir,

    html: {
        dest: baseDir + '/mockup',
        src: baseDir + '/mockup/pug'
    },

    js: {
        dest: baseDir + '/Content/Scripts',
        src: baseDir + '/Scripts'
    },

    css: {
        dest: baseDir + '/Content/Styles',
        src: baseDir + '/Styles'
    },

    browserSupport: [
        'IE >= 10',
        'IE_mob >= 10',
        'Firefox >= 40',
        'Chrome >= 44',
        'Safari >= 8',
        'iOS >= 8',
        'Android >= 4.4'
    ]
};
