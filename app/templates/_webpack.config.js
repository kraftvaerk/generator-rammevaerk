const webpack      = require('webpack');
const conf         = require('./<%= answers.projectName %>.Gulp/config');
const path         = require('path');

module.exports = {
    entry: {
        '<%= answers.projectName %>': [conf.js.src + '/<%= answers.projectName %>/index.js']
    },
    output: {
        path: path.resolve(__dirname, conf.js.dest + '/'),
        filename: '[name].bundle.js',
        chunkFilename: '[name].[chunkhash].js',
        publicPath: '/Content/Scripts/'
    },
    devtool: 'source-maps',
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
        new webpack.ProvidePlugin({
            'window.jQuery': 'jquery',
            'window.$': 'jquery'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true,
            extractComments: true
        })
    ]
};
