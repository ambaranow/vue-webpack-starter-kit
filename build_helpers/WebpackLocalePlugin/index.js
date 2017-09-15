const path = require('path'),
	fs = require('fs'),
	globExtra = require('glob-extra'),
	i18n_compile = require('i18n-compile'),
	yamljs = require('yamljs');

function fromDir(paths, outputFileName, cb) {
	globExtra.expandPaths(paths, {}, cb)
		.then((files) => {
			files.forEach((file) => {
				if (fs.existsSync(file)) {
					let content = fs.readFileSync(file, 'utf-8');
					content = '{' + content.substring(0, content.length - 1) + '}';
					content = JSON.stringify(JSON.parse(content));
					content = yamljs.stringify(JSON.parse(content), 20, 2);
					fs.writeFileSync(file + '.yaml', content);
					if (fs.existsSync(file + '.yaml')) {
						i18n_compile([file + '.yaml'], path.resolve(path.dirname(file) + '/' + outputFileName), {langPlace: '[lang]'});

						fs.unlinkSync(file)
						fs.unlinkSync(file + '.yaml')
					}
				}
			})
		})
		.done(() => {
			if (cb) {
				cb()
			}
		});
}

function LocalePlugin(options) {
	this.paths = options.paths ? options.paths : [];
	this.outputFileName = options.outputFileName ? options.outputFileName : ''
}

LocalePlugin.prototype.apply = function (compiler) {
	compiler.plugin('done', () => {
		fromDir(this.paths, this.outputFileName);
	});
};

LocalePlugin.loader = function (options) {
	return {loader: require.resolve("./loader"), options: options};
};
module.exports = LocalePlugin;
