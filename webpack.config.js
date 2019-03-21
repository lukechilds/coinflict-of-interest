const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => ({
	devtool: 'sourcemap',
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
