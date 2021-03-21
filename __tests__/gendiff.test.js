import { test, expect } from '@jest/globals';
import genDiff from '../src/gendiff.js';

test('generateDiff', () => {
  const diff = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

  expect(genDiff('__fixtures__/file1.json', '__fixtures__/file2.json')).toBe(diff);
});
