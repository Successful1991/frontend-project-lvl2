import { test, expect } from '@jest/globals';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import genDiff from '../index.js';

function getFullPath(fileName) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const fullPath = path.join(__dirname, '..', '__fixtures__', fileName);
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
  expect(genDiff(beforeJson, afterJson, 'stylish')).toBe(diffStylish);
  expect(genDiff(beforeYml, afterYml, 'stylish')).toBe(diffStylish);
  expect(genDiff(beforeJson, afterYml, 'stylish')).toBe(diffStylish);
});

test('index plain', () => {
  const diffPlain = readFile(getFullPath('resultPlain.txt'));
  expect(genDiff(beforeJson, afterJson, 'plain')).toBe(diffPlain);
  expect(genDiff(beforeYml, afterYml, 'plain')).toBe(diffPlain);
  expect(genDiff(beforeJson, afterYml, 'plain')).toBe(diffPlain);
});

test('index json', () => {
  const diffJson = readFile(getFullPath('resultJson.txt'));
  expect(genDiff(beforeJson, afterJson, 'json')).toBe(diffJson);
  expect(genDiff(beforeYml, afterYml, 'json')).toBe(diffJson);
  expect(genDiff(beforeYml, afterJson, 'json')).toBe(diffJson);
});
