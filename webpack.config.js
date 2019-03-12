const path = require('path');
const { ReactLoadablePlugin } = require('./webpack');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');



console.log('Webpack bundles project with NODE_ENV: ' + process.env.NODE_ENV);
let plugins = [
  new CleanWebpackPlugin(['dist'], {
    root: path.resolve(__dirname, 'example'),
    verbose: true,
    dry: false
  }),
  new ManifestPlugin({
    fileName: 'manifest.json',
  }),
  new ReactLoadablePlugin({
    filename:  'react-loadable.json',
  }),
];
if (process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.HashedModuleIdsPlugin());
}

module.exports = {
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          priority: 20,
          name: 'vendors',
          chunks: 'all'
        },
      }
    }
  },
  mode: process.env.NODE_ENV,
  devtool: process.env.NODE_ENV !== 'production' ? 'inline-source-map' : '',
  entry: {
    main: './example/client',
  },
  output: {
    path: path.join(__dirname, 'example', 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              ['@babel/preset-env', { modules: false }],
              '@babel/preset-react',
            ],
            plugins: [
              '@babel/plugin-syntax-dynamic-import',
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-transform-object-assign',
              require.resolve('./babel'),
            ],
          }
        },
      },
    ],
  },
  devtool: 'inline-source-map',
  resolve: {
    alias: {
      'react-loadable': path.resolve(__dirname, 'src'),
    },
  },
  plugins,
};
