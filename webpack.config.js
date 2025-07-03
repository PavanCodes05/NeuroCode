const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  target: 'node',
  mode: 'production',
  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
  },
  externals: [{ vscode: 'commonjs vscode' }],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.CO_API_KEY': JSON.stringify(process.env.CO_API_KEY),
    }),
  ],
  devtool: 'source-map',
};
