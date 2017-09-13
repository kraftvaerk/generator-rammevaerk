'use strict';

const pkg         = require('../package.json');
const baseDir     = './<%= answers.projectName %>.Website';

module.exports = {
    pkg: pkg,

    baseDir: baseDir,

    html: {
        dest: baseDir + '/Mockup',
        src: baseDir + '/Mockup'
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
        'Firefox >= 54',
        'Chrome >= 60',
        'Safari >= 10',
        'iOS >= 10.2',
        'Android >= 4.4.4'
    ]
};
