'use strict';

const csso = require('postcss-csso');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
    output: {
        filename: '[name].[contenthash].js'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [csso]
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        })
    ]
};
