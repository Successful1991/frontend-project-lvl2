import { test, expect } from '@jest/globals';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import genDiff from '../src/gendiff.js';

function getFullPath(fileName) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.join(__dirname, '..', '__fixtures__', fileName);
}

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

const diffStylish = readFile(getFullPath('resultStylish.txt'));
const diffPlain = readFile(getFullPath('resultPlain.txt'));

test('genDiff stylish', () => {
  expect(genDiff('after.json', 'before.json', 'stylish')).toBe(diffStylish);
  expect(genDiff('after.yml', 'before.yml', 'stylish')).toBe(diffStylish);
  expect(genDiff('after.yml', 'before.json', 'stylish')).toBe(diffStylish);
});

test('genDiff plain', () => {
  expect(genDiff('after.json', 'before.json', 'plain')).toBe(diffPlain);
  expect(genDiff('after.yml', 'before.yml', 'plain')).toBe(diffPlain);
  expect(genDiff('after.yml', 'before.json', 'plain')).toBe(diffPlain);
});
