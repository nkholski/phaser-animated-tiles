'use strict';

const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'production',
    watch: false,
    context: `${__dirname}/src/plugin/`,
    entry: {
        AnimatedTiles: './main.js',
        'AnimatedTiles.min': './main.js'
    },

    /*output: {
        path: `${__dirname}/dist/`,
        filename: '[name].js',
        library: 'AnimatedTiles',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },*/
    output: {
        pathinfo: true,
        path: path.resolve(__dirname, 'dev'),
        path: `${__dirname}/dist/`,
        library: '[name]',
        libraryTarget: 'umd',
        filename: '[name].js'
    },

    plugins: [
        new UglifyJSPlugin({
            include: /\.min\.js$/,
            parallel: true,
            sourceMap: false,
            uglifyOptions: {
                compress: true,
                ie8: false,
                ecma: 5,
                output: {
                    comments: false
                },
                warnings: true
            },
        })

    ],

    module: {
        rules: [{
            test: /\.js$/, // Check for all js files
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['es2015']
                }
            }]
        }]
    },
    optimization: {
        minimize: false // Let Uglify do this job for min-build only
    }
};