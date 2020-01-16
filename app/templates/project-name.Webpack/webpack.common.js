'use strict';

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // eslint-disable-line no-unused-vars
const { CleanWebpackPlugin: CleanPlugin } = require('clean-webpack-plugin');
const { ProvidePlugin } = require('webpack');
const autoprefixer = require('autoprefixer');
const ESLintPlugin = require('eslint-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');

const { scriptsDir, stylesDir, entryFiles } = require('./paths');

module.exports = {
    entry: entryFiles,
    resolve: {
        alias: {
            '@': scriptsDir
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: scriptsDir,
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [autoprefixer]
                        }
                    },
                    'sass-loader'
                ]
            }
        ]
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    plugins: [
        new CleanPlugin(),

        new ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.$': 'jquery',
            'window.jQuery': 'jquery'
        }),

        new ManifestPlugin({
            fileName: 'assets-manifest.json'
        }),

        new ESLintPlugin({
            context: scriptsDir
        }),

        new StylelintPlugin({
            context: stylesDir
        })

        // new BundleAnalyzerPlugin({
        //     analyzerMode: 'static'
        // })
    ]
};
