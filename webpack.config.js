const path = require('path');
const webpack = require('webpack');

// copy manifest.json to the path: 'public/build'
// this will allow for the authRequest to see the file at www.example.com/manifest.json
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestAssetPlugin = new CopyWebpackPlugin([ { from: 'public/manifest.json', to: 'manifest.json' } ]);
const IconAssetPlugin = new CopyWebpackPlugin([ { from: 'public/favicon.ico', to: 'favicon.ico' } ]);
const IconMobileAssetPlugin = new CopyWebpackPlugin([ { from: 'public/mobile-icon.png', to: 'mobile-icon.png' } ]);

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './public/index.html',
  filename: 'index.html',
  inject: 'body'
});

module.exports = {
  entry: './src/index.js',
  target: 'web',
  output: {
    path: '/index.js', //path.resolve('/public/build'),
    // filename: 'index_bundle.js',
    filename: 'index.js',
  },
  mode: 'development',
  devServer: {
    historyApiFallback: true,
    watchOptions: { aggregateTimeout: 300, poll: 1000 },
    headers: {
      "Access-Control-Allow-Origin": "*",
      // "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      // "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
    },
    https: false, // true for self-signed, object for cert authority
    noInfo: true, 
  },
  module: {
    rules: [
      { test: /\.json$/, use: 'json-loader' , exclude: /node_modules/},
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/,
        query: {
          presets: ['es2016', 'react']
        }
      },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/,
        loader: 'file-loader!url-loader',
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' }
    ]
  },
  plugins: [HtmlWebpackPluginConfig, ManifestAssetPlugin, IconAssetPlugin, IconMobileAssetPlugin]
}