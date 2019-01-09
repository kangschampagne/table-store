const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = function (env = { production: false }, arg) {
  return {
    mode: env.production ? 'production' : 'development',
    entry: './src/index.js',
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'TableStore',
      libraryTarget: 'umd',
      libraryExport: 'default'
    },
    devtool: env.production ? 'source-maps' : 'eval',
    devServer: {
      contentBase: './demo'
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    },
    plugins: [new HtmlWebpackPlugin()]
  }
}
