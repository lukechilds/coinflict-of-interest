const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = () => ({
	entry: {
		content: './src/content',
		background: './src/background',
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js'
	},
	devtool: 'sourcemap',
	plugins: [
		new CopyWebpackPlugin([
			{
				from: '*',
				context: 'src',
				ignore: '*.js'
			}
		])
	]
});
