const webpack      = require('webpack');
const conf         = require('./<%= answers.projectName %>.Gulp/config');
const path         = require('path');

module.exports = {
    entry: {
        '<%= answers.projectName %>': [conf.js.src + '/<%= answers.projectName %>/index.js']
    },
    output: {
        'path': path.resolve(__dirname, conf.js.dest + '/'),
        'filename': '[name].bundle.js'
    },
    devtool: 'source-maps',
    resolve: {
        modules: ['node_modules'],
        descriptionFiles: ['package.json'],
        alias: {
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', ['env', {
                            targets: {
                                browsers: conf.browserSupport
                            }
                        }]],
                        minified: true,
                        compact: true,
                        comments: true
                    }
                }
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
            sourceMap: true
        })
    ]
};
