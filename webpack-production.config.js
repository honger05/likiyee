var webpack = require('webpack')
var path = require('path')
var distPath = path.resolve(__dirname, 'dist')
var nodeModulesPath = path.resolve(__dirname, 'node_modules')
var TransferWebpackPlugin = require('transfer-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var config = {
  env: process.env.NODE_ENV,
  path: {
    src: path.resolve(__dirname, "src/www"),
    app: path.resolve(__dirname, "src/app"),
    dist: path.resolve(__dirname, "dist"),
    gallery: path.resolve(__dirname, "gallery")
  },
  defaultPath: "http://www.yy.com/",
  cdn: "http://www.yy.com"
}

var route = [
  'index', 'login', 'withheld', 'dowithheld',
  'survey', 'dosurvey', 'modifypwd', 'unicorn'
]

var proConfig = {
  entry: {
    common: ['jquery', 'handlebars', 'amazeui', 'underscore', 'utils']
  },
  output: {
    path: distPath,
    filename: './scripts/[name].bundle.js',
    chunkFilename: './scripts/[id].chunk.js'
  },
  resolve: {
    extensions: ["", ".js", ".jsx", ".es6", "css", "scss", "png", "jpg", "jpeg"],
    alias: {
      'jquery': path.join(config.path.gallery, '/lib/jquery'),
      'handlebars': path.join(config.path.gallery, '/lib/handlebars'),
      'utils': path.join(config.path.gallery, '/utilities/utils')
    }
  },
  // devtool: 'source-map',
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "common",
      filename: "scripts/common.js",
      chunks: route
    }),

    new webpack.optimize.OccurenceOrderPlugin(),

    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      Handlebars: "handlebars"
    }),

    new ExtractTextPlugin('styles/[name].css'),

    new webpack.NoErrorsPlugin(),

    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   },
    //   mangle: {
    //     except: ['jQuery', '$', 'exports', 'require']
    //   }
    // }),

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
        test: /\.(jpg|png|gif)$/i,
        loader: "url-loader?limit=1000&name=img/[name]-[hash:10].[ext]",
        include: path.resolve(config.path.src)
      },
      {
        test: /\.handlebars$/,
        loader: 'handlebars-loader'
      },
      {
        test: /\.hbs$/,
        loader: path.resolve(__dirname, "loaders/hbs-loader")
      },
      {
        test: path.join(config.path.gallery, '/lib/handlebars'),
        loader: 'expose?Handlebars'
      },
      {
        test: path.join(config.path.gallery, '/lib/jquery'),
        loader: 'expose?jQuery'
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,
        loader: 'url-loader?importLoaders=1&limit=1000&name=fonts/[name].[ext]'
      }
    ]
  }
}

route.forEach(function(item) {
  proConfig.entry[item] = path.join(config.path.app, '/components/'+ item +'/'+ item +'.js')

  var htmlPlugin = new HtmlWebpackPlugin({
    filename: item + '.html',
    template: 'src/tmpl/' + item + '.html',
    hash: true,
    inject: 'body',
    chunks: [ item ]
  })

  proConfig.plugins.push(htmlPlugin)
})

module.exports = proConfig
