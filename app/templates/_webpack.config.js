'use strict';

const { mergeWithRules } = require('webpack-merge');
const dotenv = require('dotenv');

const common = require('./<%= answers.projectName %>.Webpack/webpack.common');
const dev = require('./<%= answers.projectName %>.Webpack/webpack.dev');
const prod = require('./<%= answers.projectName %>.Webpack/webpack.prod');

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

const merger = mergeWithRules({
    module: {
        rules: {
            test: 'match',
            use: {
                loader: 'match',
                options: 'replace'
            }
        }
    }
});

module.exports = merger(common, isProd ? prod : dev);
