const Yaml = require('yamljs');

module.exports = function(source) {
	this.cacheable && this.cacheable();
	var value = JSON.stringify(Yaml.parse(source));
	var result = value.substring(1, value.length-1) + ',';
	return "module.exports = " + JSON.stringify(result);
};
