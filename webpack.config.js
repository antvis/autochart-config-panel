/* eslint-disable */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    'config-panel': './src/config-panel',
    'mock-panel': './src/mock-panel',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin()],
  },
  output: {
    path: path.join(__dirname, './www'),
    filename: '[name].js',
    publicPath: '/',
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    antd: 'antd',
    moment: 'moment',
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
    mainFields: ['module', 'browser', 'main'],
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(css|less)$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'less-loader', options: { sourceMap: true, javascriptEnabled: true } },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      title: 'Chart Configs',
      filename: 'config-panel.html',
      template: 'src/template.ejs',
      chunks: ['config-panel'],
    }),
    new HtmlWebpackPlugin({
      title: 'Guide',
      filename: 'mock-panel.html',
      template: 'src/template.ejs',
      chunks: ['mock-panel'],
    }),
  ],
};
