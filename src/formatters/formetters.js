import formatterStylish from './stylish.js';
import formatterPlain from './plain.js';
import formatterJson from './json.js';

function getFormattingHandler(name) {
  switch (name) {
    case 'stylish':
      return formatterStylish;
    case 'plain':
      return formatterPlain;
    case 'json':
      return formatterJson;
    default:
      return formatterStylish;
  }
}
export default getFormattingHandler;
