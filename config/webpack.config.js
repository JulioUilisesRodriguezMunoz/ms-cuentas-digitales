import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import { green, blue } from 'chalk'

export default {
  mode: 'production',
  entry: {
    main: './src/server'
  },
  output: {
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    node: true
                  }
                }
              ]
            ],
            plugins: ['istanbul', '@babel/plugin-transform-runtime'],
            sourceType: 'unambiguous'
          }
        }
      }
    ]
  },
  target: ['node', 'es2017'],
  plugins: [
    new ProgressBarPlugin({
      format: `Building [${blue(':bar')}] ${green(
        ':percent'
      )} (:elapsed seconds)`,
      clear: false
    })
  ]
}
