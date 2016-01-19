var webpack = require('webpack')
var path = require('path')
var distPath = path.resolve(__dirname, 'dist')
var nodeModulesPath = path.resolve(__dirname, 'node_modules')
var TransferWebpackPlugin = require('transfer-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    devServer: 'webpack/hot/dev-server',
    vendor: ['jquery'],
    index: './src/app/components/index/index.js',
    login: './src/app/components/login/login.js'
  },
  output: {
    path: distPath,
    filename: './script/[name].bundle.js',
    chunkFilename: './script/[id].chunk.js'
  },

  // 页面中引入
  // externals: {
  //   'jquery': 'window.jQuery',
  //   '$': 'window.jQuery'
  // },

  devServer: {
    contentBase: 'src/www',
    devtool: 'eval',
    hot: true,
    inline: true,
    port: 3000
  },
  devtool: 'eval',
  resolve: {
    extensions: ['', '.js', 'jsx', '.json', '.coffee']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),

    // new webpack.ProvidePlugin({
    //   $: "jquery",
    //   jQuery: "jquery",
    //   "window.jQuery": "jquery"
    // }),

    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),

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
        test: /\.(js|jsx)$/,
        loader: 'babel'
      },
      {
        test: /\.less$/,
        loader: 'style!css!less'
      },{
        test: /\.scss$/,
        loader: 'style!css!sass'
      },{
        test: /\.css$/,
        loader: 'style!css!autoprefixer'
      },{
        test: /\.(png|jpg|gif)$/,
        loader: 'url?limit=2500000'
      },
      {
        test: /\.html$/,
        loader: 'html'
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        loader: 'url?limit=100000'
      }
    ]
  }
}
