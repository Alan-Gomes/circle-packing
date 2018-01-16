const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: "./src/index.js",
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.[chunkhash].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Projeto em p5.js',
      template: __dirname + '/src/index.html'
    }),
    new CleanWebpackPlugin(__dirname + '/dist')
  ]
};
