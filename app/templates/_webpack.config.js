import webpack from 'webpack';
import path    from 'path';
import config  from './<%= answers.projectName %>.Gulp/config';

export default {
    entry: {
        '<%= answers.projectName %>': [config.js.src + '/<%= answers.projectName %>/index.js']
    },
    output: {
        path: path.resolve(__dirname, config.js.dest),
        publicPath: config.js.dest.replace(config.baseDir, '') + '/',
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
    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development'
        }),
        new webpack.ProvidePlugin({
            'window.jQuery': 'jquery',
            'window.$': 'jquery'
        }),
        ...global.production ? [new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            extractComments: true
        })] : []
    ]
};
