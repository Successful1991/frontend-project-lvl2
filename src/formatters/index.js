import formatterStylish from './stylish.js';
import formatterPlain from './plain.js';

export default function getFormatter(formatName) {
  switch (formatName) {
    case 'stylish':
      return formatterStylish;
    case 'plain':
      return formatterPlain;
    case 'json':
      return JSON.stringify;
    default:
      throw new Error(`Unknown name format: '${formatName}'`);
  }
}
