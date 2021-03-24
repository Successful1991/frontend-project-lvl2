import stylish from './stylish.js';
import plain from './plain.js';

function getFormatHandler(name) {
  console.log(name);
  switch (name) {
    case 'stylish':
      return stylish;
    case 'plain':
      return plain;
    default:
      return stylish;
  }
}
export default getFormatHandler;
