'use strict';

const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {

    context: `${__dirname}/src/`,

    entry: {
        app: [
           // 'babel-preset-es2015',
            path.resolve(__dirname, 'src/main.js'),
          ],
    },

    output: {
        path: `${__dirname}/dist/`,
        filename: 'AnimatedTiles.js',
        library: 'AnimatedTiles',
        libraryTarget: 'umd',
        umdNamedDefine: true
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
                warnings: false
            },
            warningsFilter: (src) => false
        })

    ]

};
