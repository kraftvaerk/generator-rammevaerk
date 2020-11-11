'use strict';

const { join } = require('path');
const { scriptsDir, stylesDir } = require('./paths');

module.exports = [
    join(scriptsDir, './<%= answers.projectName %>/index.js'),
    join(stylesDir, './<%= answers.projectName %>/index.scss')
];
