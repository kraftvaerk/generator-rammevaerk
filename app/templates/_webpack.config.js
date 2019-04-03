import path from 'path';
import webpack from 'webpack';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import config from './<%= answers.projectName %>.Gulp/config';

const production = process.env.NODE_ENV === 'production';
const bundleFilename = '[name].bundle.js';

export default {
    mode: production ? 'production' : 'development',
    entry: {
        '<%= answers.projectName %>': `${config.js.src}/<%= answers.projectName %>/index.js`
    },
    output: {
        path: path.resolve(__dirname, config.js.dest),
        publicPath: `${config.js.dest.replace(config.baseDir, '')}/`,
        filename: bundleFilename,
        chunkFilename: '[name].[chunkhash].chunk.js'
    },
    devtool: production ? 'source-map' : 'cheap-module-eval-source-map',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, config.js.src)
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: !production
                },
                include: [
                    path.resolve(__dirname, config.js.src)
                ]
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
                    test: /node_modules/,
                    name: '<%= answers.projectName %>.vendor',
                    chunks: 'initial',
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
