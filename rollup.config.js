import babel from 'rollup-plugin-babel'
import pkg from './package.json';

const license = `/*!
 * @author yomotsu
 * DOMSlideshow
 * https://github.com/yomotsu/dom-slideshow
 * Released under the MIT License.
 */`

export default {
	input: 'src/index.js',
	output: [
		{
			format: 'umd',
			name: 'DOMSlideshow',
			file: pkg.main,
			banner: license,
			indent: '\t',
		},
		{
			format: 'es',
			file: pkg.module,
			banner: license,
			indent: '\t',
		}
	],
	plugins: [
		babel( { exclude: 'node_modules/**' } )
	]
};
