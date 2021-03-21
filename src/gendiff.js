import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

function getFullPath(fileName) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.join(__dirname, '..', '__fixtures__', fileName);
}

function readFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getSortKeys(value1, value2) {
  const keys1 = Object.keys(value1);
  const keys2 = Object.keys(value2);
  return _.union(keys1, keys2).sort();
}

function checkKey(file, key) {
  return _.has(file, [key]);
}

function checkValuesMatch(file1, file2, key) {
  return checkKey(file1, [key])
    && checkKey(file2, [key])
    && file1[key] === file2[key];
}

function genDiffObj(file1, file2, keys) {
  const result = keys.map((key) => {
    switch (true) {
      case checkValuesMatch(file1, file2, key):
        return `    ${key}: ${file1[key]}`;
      case (checkKey(file1, [key]) && checkKey(file2, [key])):
        return [`  - ${key}: ${file1[key]}`, `  + ${key}: ${file2[key]}`].join('\n');
      case checkKey(file1, [key]):
        return `  - ${key}: ${file1[key]}`;
      case checkKey(file2, [key]):
        return `  + ${key}: ${file2[key]}`;
      default:
        return '';
    }
  }).join('\n');
  return ['{', result, '}'].join('\n');
}

function genDiff(path1, path2) {
  const file1 = readFile(getFullPath(path1));
  const file2 = readFile(getFullPath(path2));
  const sortKeys = getSortKeys(file1, file2);
  const diff = genDiffObj(file1, file2, sortKeys);
  return diff;
}

export default genDiff;
