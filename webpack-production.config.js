var webpack = require('webpack')
var path = require('path')
var distPath = path.resolve(__dirname, 'dist')
var nodeModulesPath = path.resolve(__dirname, 'node_modules')
var TransferWebpackPlugin = require('transfer-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    index: './src/app/components/index/index.js',
    login: './src/app/components/login/login.js'
  },
  output: {
    path: distPath,
    filename: './script/[name].bundle.js',
    chunkFilename: './script/[id].chunk.js'
  },
  resolve: {
    extensions: ['', '.js', '.json', '.coffee']
  },
  devtool: 'source-map',
  plugins: [
    new ExtractTextPlugin('./style/[name].css'),

    new HtmlWebpackPlugin({
      title: 'index',
      filename: 'index.html',
      hash: true,
      template: './src/tmpl/index.html',
      chunks: ['index'],
      inject: 'body'
    }),

    new HtmlWebpackPlugin({
      title: 'login',
      filename: 'login.html',
      hash: true,
      template: './src/tmpl/login.html',
      chunks: ['login'],
      inject: 'body'
    }),

    new TransferWebpackPlugin([
      {from: 'www'}
    ], path.resolve(__dirname, "src"))

  ],
  module: {
    loaders: [
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
      },{
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
      },{
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader')
      },{
        test: /\.hbs$/,
        loader: 'handlebars'
      },{
        test: /\.(png|jpg|gif)$/,
        loader: 'url?limit=25000'
      },
      {
        test: /\.html$/,
        loader: 'html'
      },
      {
        test: /\.ttf$/,
        loader: 'url?limit=100000'
      }
    ]
  }
}
