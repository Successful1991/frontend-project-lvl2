import { test, expect } from '@jest/globals';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import genDiff from '../index.js';

function getFullPath(fileName) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const fullPath = path.join(__dirname, '..', '__fixtures__', fileName);
  console.log(fullPath);
  return fullPath;
}

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

const afterJson = getFullPath('after.json');
const beforeJson = getFullPath('before.json');
const afterYml = getFullPath('after.yml');
const beforeYml = getFullPath('before.yml');

test('index stylish', () => {
  const diffStylish = readFile(getFullPath('resultStylish.txt'));
  expect(genDiff(afterJson, beforeJson, 'stylish')).toBe(diffStylish);
  expect(genDiff(afterYml, beforeYml, 'stylish')).toBe(diffStylish);
  expect(genDiff(afterYml, beforeJson, 'stylish')).toBe(diffStylish);
});

test('index plain', () => {
  const diffPlain = readFile(getFullPath('resultPlain.txt'));
  expect(genDiff(afterJson, beforeJson, 'plain')).toBe(diffPlain);
  expect(genDiff(afterYml, beforeYml, 'plain')).toBe(diffPlain);
  expect(genDiff(afterYml, beforeJson, 'plain')).toBe(diffPlain);
});

test('index json', () => {
  const diffJson = readFile(getFullPath('resultJson.txt'));
  expect(genDiff(afterJson, beforeJson, 'json')).toBe(diffJson);
  expect(genDiff(afterYml, beforeYml, 'json')).toBe(diffJson);
  expect(genDiff(afterYml, beforeJson, 'json')).toBe(diffJson);
});
