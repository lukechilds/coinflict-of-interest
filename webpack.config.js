const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => ({
	devtool: 'sourcemap',
	stats: 'errors-only',
	output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'content.js',
  },
	plugins: [
		new CopyWebpackPlugin([
			{
				from: '*',
				context: 'src',
				ignore: '*.js'
			},
		])
	],
});
