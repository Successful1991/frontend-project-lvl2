import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import getParser from './parsers.js';

function getFullPath(fileName) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.join(__dirname, '..', '__fixtures__', fileName);
}

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

const getTypeFile = (filePath) => path.extname(filePath);

function getSortKeys(value1 = {}, value2 = {}) {
  const keys1 = Object.keys(value1);
  const keys2 = Object.keys(value2);
  return _.union(keys1, keys2).sort();
}

function includesKey(file, key) {
  return _.has(file, [key]);
}

function stylish(indent, markDistinction, key, value) {
  switch (markDistinction) {
    case 'add':
      return `${indent}+ ${key}: ${value}`;
    case 'remove':
      return `${indent}- ${key}: ${value}`;
    default:
      return `${indent}  ${key}: ${value}`;
  }
}

function genDiff(path1, path2, genStyle = stylish, spacesCount = 2) {
  const parserPath1 = getParser(getTypeFile(path1));
  const parserPath2 = getParser(getTypeFile(path2));
  const file1 = parserPath1(readFile(getFullPath(path1)));
  const file2 = parserPath2(readFile(getFullPath(path2)));

  const iter = (after, before, depth) => {
    const keys = getSortKeys(after, before);
    const indentSize = depth * spacesCount;
    const currentIndent = _.repeat(' ', indentSize);
    const bracketIndent = _.repeat(' ', indentSize - spacesCount);
    const result = keys.map((key) => {
      switch (true) {
        case (includesKey(after, [key]) && includesKey(before, [key])):
          switch (true) {
            case (_.isObject(after[key]) && _.isObject(before[key])):
              return genStyle(currentIndent, '', key, iter(after[key], before[key], depth + 2));
            case _.isObject(after[key]):
              return [
                genStyle(currentIndent, 'remove', key, iter(after[key], after[key], depth + 2)),
                genStyle(currentIndent, 'add', key, before[key]),
              ].join('\n');
            case _.isObject(before[key]):
              return [
                genStyle(currentIndent, 'remove', key, iter(before[key], before[key], depth + 2)),
                genStyle(currentIndent, 'add', key, after[key]),
              ].join('\n');
            default:
              if (after[key] === before[key]) {
                return genStyle(currentIndent, '', key, after[key]);
              }
              return [
                genStyle(currentIndent, 'remove', key, after[key]),
                genStyle(currentIndent, 'add', key, before[key]),
              ].join('\n');
          }
        case includesKey(after, [key]):
          if (_.isObject(after[key])) {
            return genStyle(currentIndent, 'remove', key, iter(after[key], after[key], depth + 2));
          }
          return `${currentIndent}- ${key}: ${after[key]}`;
        case includesKey(before, [key]):
          if (_.isObject(before[key])) {
            return genStyle(currentIndent, 'add', key, iter(before[key], before[key], depth + 2));
          }
          return genStyle(currentIndent, 'add', key, before[key]);
        default:
          return '';
      }
    });
    return ['{', ...result, `${bracketIndent}}`].join('\n');
  };
  return iter(file1, file2, 1);
}

export default genDiff;
