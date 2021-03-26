import { test, expect } from '@jest/globals';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import genDiff from '../src/genDiff';

function getFullPath(fileName) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const fullPath = path.join(__dirname, '..', '__tests__', '__fixtures__', fileName);
  return fullPath;
}

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

const file1Json = getFullPath('file1.json');
const file2Json = getFullPath('file2.json');
const file2Yml = getFullPath('file2.yml');
const file1Yml = getFullPath('file1.yml');

test('stylish diff of different nested files', () => {
  const diffStylish = readFile(getFullPath('resultStylish.txt'));
  expect(genDiff(file1Json, file2Json, 'stylish')).toBe(diffStylish);
  expect(genDiff(file1Yml, file2Yml, 'stylish')).toBe(diffStylish);
  expect(genDiff(file1Json, file2Yml, 'stylish')).toBe(diffStylish);
});

test('plain diff of different nested files', () => {
  const diffPlain = readFile(getFullPath('resultPlain.txt'));
  expect(genDiff(file1Json, file2Json, 'plain')).toBe(diffPlain);
  expect(genDiff(file1Yml, file2Yml, 'plain')).toBe(diffPlain);
  expect(genDiff(file1Json, file2Yml, 'plain')).toBe(diffPlain);
});

test('index json', () => {
  const diffJson = readFile(getFullPath('resultJson.txt'));
  expect(genDiff(file1Json, file2Json, 'json')).toBe(diffJson);
  expect(genDiff(file1Yml, file2Yml, 'json')).toBe(diffJson);
  expect(genDiff(file1Yml, file2Json, 'json')).toBe(diffJson);
});
