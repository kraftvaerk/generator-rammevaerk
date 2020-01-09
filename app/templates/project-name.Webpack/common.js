const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // eslint-disable-line no-unused-vars
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { ProvidePlugin } = require('webpack');
const autoprefixer = require('autoprefixer');
const ESLintPlugin = require('eslint-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const StylelintPlugin = require('stylelint-webpack-plugin');

module.exports = {
    entry: [
        './<%= answers.projectName %>.Website/Scripts/<%= answers.projectName %>/index.js',
        './<%= answers.projectName %>.Website/Styles/<%= answers.projectName %>/index.scss'
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../<%= answers.projectName %>.Website/Scripts')
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /[\\/]node_modules[\\/]/,
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
        new CleanWebpackPlugin(),

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
            context: './<%= answers.projectName %>.Website/Scripts'
        }),

        new StylelintPlugin({
            context: './<%= answers.projectName %>.Website/Styles'
        })

        // new BundleAnalyzerPlugin({
        //     analyzerMode: 'static'
        // })
    ]
};
