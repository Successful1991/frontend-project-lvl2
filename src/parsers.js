import yaml from 'js-yaml';

export default function getParser(type) {
  switch (type) {
    case 'json':
      return JSON.parse;
    case 'yml':
      return yaml.load;
    default:
      return JSON.parse;
  }
}
