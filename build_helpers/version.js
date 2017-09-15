const fs = require('fs');
const log = require('gutil-color-log')
module.exports = function() {
	var version;
	try {
		version = fs.readFileSync('./version.txt', 'utf8');
		version = version.trim();
		version = version.replace(/\r?\n|\r|\s/g,'');
		if(version.length === 0) {
			version = (new Date()).getTime();
		}
	} catch(err) {
		version = (new Date()).getTime();
		log('red', `error: ${err}`);
	}
	log('blue', `version: ${version}`)
	return version;
}
