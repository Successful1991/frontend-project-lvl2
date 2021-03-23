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

const diff = readFile(getFullPath('result.txt'));

test('generateDiff json', () => {
  expect(genDiff('after.json', 'before.json')).toBe(diff);
  expect(genDiff('after.yml', 'before.yml')).toBe(diff);
  expect(genDiff('after.yml', 'before.json')).toBe(diff);
});
