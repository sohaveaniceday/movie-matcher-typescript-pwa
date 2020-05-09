module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'postcss-loader'],
      },
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
      }
    ]
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ]
}