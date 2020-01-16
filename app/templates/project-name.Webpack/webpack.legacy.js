'use strict';

const { join: winJoin, posix: { join: posixJoin } } = require('path');
const { destDir, publicDir } = require('./paths');

module.exports = {
    output: {
        path: winJoin(destDir, './legacy'),
        publicPath: posixJoin(publicDir, './legacy/')
    }
};
