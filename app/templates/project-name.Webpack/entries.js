'use strict';

const { join } = require('path');
const { scriptsDir, stylesDir } = require('./paths');

module.exports = [
    join(scriptsDir, './index.js'),
    join(stylesDir, './index.scss')
];
