'use strict';

const { join } = require('path');

const srcDir = join(__dirname, '../<%= answers.projectName %>.Website');
const destDir = join(srcDir, './Content');
const publicDir = '/Content';
const scriptsDir = join(srcDir, './Scripts');
const stylesDir = join(srcDir, './Styles');
const entryFiles = [
    join(scriptsDir, './<%= answers.projectName %>/index.js'),
    join(stylesDir, './<%= answers.projectName %>/index.scss')
];

module.exports = {
    srcDir,
    destDir,
    publicDir,
    scriptsDir,
    stylesDir,
    entryFiles
};
