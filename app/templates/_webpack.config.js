'use strict';

const dotenv = require('dotenv');
const merge = require('webpack-merge');

const common = require('./<%= answers.projectName %>.Webpack/webpack.common');
const dev = require('./<%= answers.projectName %>.Webpack/webpack.dev');
const legacy = require('./<%= answers.projectName %>.Webpack/webpack.legacy');
const modern = require('./<%= answers.projectName %>.Webpack/webpack.modern');
const prod = require('./<%= answers.projectName %>.Webpack/webpack.prod');

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';
const isModern = process.env.BROWSERSLIST_ENV === 'modern';

module.exports = merge.smart(
    common,
    isProd ? prod : dev,
    isModern ? modern : legacy
);
