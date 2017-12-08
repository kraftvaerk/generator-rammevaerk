const webpack      = require('webpack');
const conf         = require('./<%= answers.projectName %>.Gulp/config');
const path         = require('path');
const production   = process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        '<%= answers.projectName %>': [conf.js.src + '/<%= answers.projectName %>/index.js']
    },
    output: {
        path: path.resolve(__dirname, conf.js.dest),
        publicPath: conf.js.dest.replace(conf.baseDir, '') + '/',
        filename: '[name].bundle.js',
        chunkFilename: '[name].[chunkhash].chunk.js'
    },
    devtool: production ? 'source-maps' : 'cheap-module-eval-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development'
        }),
        new webpack.ProvidePlugin({
            'window.jQuery': 'jquery',
            'window.$': 'jquery'
        }),
        ...production ? [new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            extractComments: true
        })] : []
    ]
};
