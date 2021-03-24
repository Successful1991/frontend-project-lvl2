import { test, expect } from '@jest/globals';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import index from '../index.js';

function getFullPath(fileName) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  // return path.join(__dirname, fileName);
  return path.join(__dirname, '..', '__fixtures__', fileName);
}

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

test('index stylish', () => {
  const diffStylish = readFile(getFullPath('resultStylish.txt'));
  expect(index('after.json', 'before.json', 'stylish')).toBe(diffStylish);
  expect(index('after.yml', 'before.yml', 'stylish')).toBe(diffStylish);
  expect(index('after.yml', 'before.json', 'stylish')).toBe(diffStylish);
});

test('index plain', () => {
  const diffPlain = readFile(getFullPath('resultPlain.txt'));
  expect(index('after.json', 'before.json', 'plain')).toBe(diffPlain);
  expect(index('after.yml', 'before.yml', 'plain')).toBe(diffPlain);
  expect(index('after.yml', 'before.json', 'plain')).toBe(diffPlain);
});

test('index json', () => {
  const diffJson = readFile(getFullPath('resultJson.txt'));
  expect(index('after.json', 'before.json', 'json')).toBe(diffJson);
  expect(index('after.yml', 'before.yml', 'json')).toBe(diffJson);
  expect(index('after.yml', 'before.json', 'json')).toBe(diffJson);
});
