import yaml from 'js-yaml';

function getParser(type) {
  switch (type) {
    case '':
      return JSON.parse;
    case '.json':
      return JSON.parse;
    case '.yml':
      return yaml.load;
    default:
      return (date) => date;
  }
}

export default getParser;
