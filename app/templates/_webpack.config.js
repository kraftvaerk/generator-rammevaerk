import path from 'path';
import webpack from 'webpack';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import config from './<%= answers.projectName %>.Gulp/config';

export default {
    mode: global.production ? 'production' : 'development',
    entry: {
        '<%= answers.projectName %>': [`${config.js.src}/<%= answers.projectName %>/index.js`]
    },
    output: {
        path: path.resolve(__dirname, config.js.dest),
        publicPath: `${config.js.dest.replace(config.baseDir, '')}/`,
        filename: '[name].bundle.js',
        chunkFilename: '[name].[chunkhash].chunk.js'
    },
    devtool: global.production ? 'source-maps' : 'cheap-module-eval-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
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
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: '<%= answers.projectName %>.vendor',
                    chunks: 'all',
                    filename: '[name].bundle.js'
                }
            }
        }
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development'
        }),
        new webpack.ProvidePlugin({
            'window.jQuery': 'jquery',
            'window.$': 'jquery'
        })
    ]
};
