const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  } else if (m.name) {
    return m.name;
  } else {
    return false;
  }
}

module.exports = {
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	entry: {
		main: './src/main.scss',
		styleguide: './src/styleguide.scss'
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
	},
	plugins: [new MiniCssExtractPlugin({
		filename: '[name].css'
	})],

	optimization: {
    splitChunks: {
      cacheGroups: {
        mainStyles: {
          name: 'main',
          test: (m, c, entry = 'main') =>
            m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true,
        },
        styleguideStyles: {
          name: 'styleguide',
          test: (m, c, entry = 'styleguide') =>
            m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true,
        },
      },
    },
	},

	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					{
						loader: 'css-loader',
						options: {
							url: true
						}
					},
					{
						loader: 'sass-loader'
					}
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
				use: [
					{
						loader: 'file-loader'
					}
				]
			}
		]
	}
};