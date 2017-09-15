let instance = null;
import metaConfig from 'Config/meta';

// Выставляем мета теги в приложении

class Meta {
  constructor() {
    if(!instance){
      instance = this;
    }

    return instance;
  }
  getTitle() {
    let collection = [];
    for (let i = 0; i < arguments.length; i++) {
      if (arguments[i]) {
        collection.push(arguments[i]);
      }
    }
    collection.push(metaConfig.title);

    return collection.join(' / ');
  }
  getDescription(mod, params) {
    if (mod && metaConfig[mod] && metaConfig[mod].description) {
      let description = this.placeParts(metaConfig[mod].description, params);
      if (description.length) {
        let lastPart = description[description.length - 1];
        if (lastPart[lastPart.length - 1] === ',') {
          description[description.length - 1] = lastPart.slice(0, lastPart.length - 1);
        }
        return description.join(' ');
      }
    }

    return metaConfig.description;
  }
  getKeywords(mod, params) {
    if (mod && metaConfig[mod] && metaConfig[mod].keywords) {
      let keywords = this.placeParts(metaConfig[mod].keywords, params);
      if (keywords.length) {
        for (let i = 0; i < keywords.length; i++) {
          keywords[i] = keywords[i].toLowerCase();
        }
        return keywords.join(', ');
      }
    }

    return metaConfig.keywords;
  }
  placeParts(parts, params) {
    let result = [];
    for (let i = 0; i < parts.length; i++) {
      let part = parts[i];
      let matchResult = part.match(/\%(.*)\%/);
      if (matchResult) {
        let field = matchResult[1];
        if (params.hasOwnProperty(field) && (params[field] || typeof params[field] === 'Number')) {
          part = part.replace(`%${field}%`, params[field]);
          result.push(part);
        }
      } else {
        result.push(part);
      }
    }

    return result;
  }
}
export default new Meta()