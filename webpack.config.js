const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = [
  {
    mode: 'production',
    entry: ['./src/extension.ts'],
    output: {
      filename: 'extension.js',
      library: 'init',
      libraryTarget: 'var',
      libraryExport: 'default',
    },

    plugins: [
      new webpack.ProgressPlugin(),
      new MiniCssExtractPlugin({ filename: 'stylesheet.css' }),
      new CopyPlugin({
        patterns: [
          { from: './resources/metadata.json', to: 'metadata.json' },
          { from: './resources/schemas', to: 'schemas' },
        ],
      }),
    ],

    module: {
      rules: [
        {
          test: /.(ts)$/,
          loader: 'ts-loader',
          exclude: [/node_modules/],
        },
        {
          test: /.(scss|css)$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'sass-loader',
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@imports': path.resolve(__dirname, './@types/Gjs'),
      },
    },
    optimization: {
      minimize: false,
    },
  },
  {
    mode: 'production',
    entry: ['./src/prefs/prefs.ts'],
    output: {
      filename: 'prefs.js',
      library: ['var { init, buildPrefsWidget }'],
      libraryTarget: 'assign',
      libraryExport: 'default',
    },

    plugins: [new webpack.ProgressPlugin(), new CopyPlugin({ patterns: [{ from: './resources/ui', to: 'ui' }] })],

    module: {
      rules: [
        {
          test: /.(ts)$/,
          loader: 'ts-loader',
          exclude: [/node_modules/],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@imports': path.resolve(__dirname, './@types/Gjs'),
      },
    },
    optimization: {
      minimize: false,
    },
  },
];
