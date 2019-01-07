import path from 'path';
import webpack from 'webpack';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import config from './<%= answers.projectName %>.Gulp/config';

const bundleFilename = '[name].bundle.js';
const chunkFilename = '[name].[chunkhash].chunk.js';
const vendorRegex = /node_modules/;

export default {
    mode: global.production ? 'production' : 'development',
    entry: {
        '<%= answers.projectName %>': `${config.js.src}/<%= answers.projectName %>/index.js`
    },
    output: {
        path: path.resolve(__dirname, config.js.dest),
        publicPath: `${config.js.dest.replace(config.baseDir, '')}/`,
        filename: bundleFilename,
        chunkFilename: chunkFilename
    },
    devtool: global.production ? 'source-map' : 'cheap-module-eval-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: vendorRegex,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: !global.production
                }
            }
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: true,
                extractComments: true
            })
        ],
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: vendorRegex,
                    name: '<%= answers.projectName %>.vendor',
                    chunks: 'all',
                    filename: bundleFilename
                }
            }
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.$': 'jquery',
            'window.jQuery': 'jquery'
        })
    ]
};
