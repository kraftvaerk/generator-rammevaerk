'use strict';

const dotenv = require('dotenv');
const merge = require('webpack-merge');

const common = require('./<%= answers.projectName %>.Webpack/webpack.common');
const dev = require('./<%= answers.projectName %>.Webpack/webpack.dev');
const prod = require('./<%= answers.projectName %>.Webpack/webpack.prod');

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

module.exports = merge.smart(common, isProd ? prod : dev);
