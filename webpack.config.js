// updated for webpack v2
const path = require('path');
const webpack = require('webpack');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { TsConfigPathsPlugin, CheckerPlugin } = require('awesome-typescript-loader');

const PATHS = {
  root: path.resolve(__dirname),
  nodeModules: path.resolve(__dirname, './node_modules'),
  src: path.resolve(__dirname, './src'),
  clientOutputDir: path.resolve(__dirname, './dist'),
};

const isProd = () => process.env.NODE_ENV === 'production';
const isDevBuild = !isProd();

// site.css is the name of the output file, this plugin is added to the plugins array later
const extractCSS = new MiniCssExtractPlugin('site.css'); //TODO: Produce seperate CSS files

const config = {
  resolve: {
    plugins: [
      new TsConfigPathsPlugin({
        configFileName: "tsconfig.json",
        compiler: "typescript"
      }),
    ],
    extensions: ['.js', '.jsx', '.ts', '.tsx'] // https://webpack.js.org/configuration/resolve/#resolve-extensions
},
  entry: {
    // Can have an array of properties for outputting multiple js files
    // Can have an array of entry points for one js file
    'main-client': './src/entry.tsx',
  },

  output: {
    path: PATHS.clientOutputDir,
    filename: '[name].js', // [name] is a placeholder and is replaced by the file's name
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'awesome-typescript-loader?silent=true' // This is just syntax for loader?options
      },
      { test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: 'url-loader?limit=25000'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          // { loader: 'style-loader', options: { sourceMap: !isProd() } },
          // extract() creates an extracting loader from an existing loader
          // ExtractTextPlugin.extract() should be used if there are multiple instaces of ExtractTextPlugin
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              minimize: isProd(),
              modules: true,
              sourceMap: !isProd(),
              importLoaders: 1, // Number of loaders applied before CSS loader
              localIdentName: '[name]__[local]___[hash:base64:5]'
            },
          }
        ],
      },
    ],
  },

  plugins: [
    extractCSS,
    new CheckerPlugin(),
  ],
  watchOptions:
    {
      // one second grace period to add minor updates that will get aggregated into the same compile
      aggregateTimeout: 1000,
      ignored: /node_modules/
    },
};
module.exports = config;
