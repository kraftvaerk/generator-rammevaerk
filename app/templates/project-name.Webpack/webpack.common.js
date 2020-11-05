'use strict';

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // eslint-disable-line no-unused-vars
const { CleanWebpackPlugin: CleanPlugin } = require('clean-webpack-plugin');
const { ProvidePlugin } = require('webpack');
const AssetManifestPlugin = require('webpack-manifest-plugin');
const autoprefixer = require('autoprefixer');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');

const {
    destDir,
    publicDir,
    scriptsDir,
    stylesDir
} = require('./paths');

const entries = require('./entries');

module.exports = {
    entry: entries,
    output: {
        path: destDir,
        publicPath: publicDir
    },
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
                            postcssOptions: {
                                plugins: [autoprefixer]
                            }
                        }
                    },
                    'sass-loader'
                ]
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all'
                }
            }
        },
        runtimeChunk: 'single',
        moduleIds: 'hashed'
    },
    plugins: [
        new CleanPlugin(),

        new ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.$': 'jquery',
            'window.jQuery': 'jquery'
        }),

        new AssetManifestPlugin({
            fileName: 'asset-manifest.json'
        }),

        new EslintPlugin({
            context: scriptsDir,
            emitError: false
        }),

        new StylelintPlugin({
            context: stylesDir,
            emitError: false
        })

        // new BundleAnalyzerPlugin({
        //     analyzerMode: 'static'
        // })
    ]
};
