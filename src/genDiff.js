import path from 'path';
import fs from 'fs';
import getParser from './parsers.js';
import buildDataTree from './buildDataTree.js';
import getFormatter from './formatters/index.js';

function readFile(pathToFile) {
  const workingDir = process.cwd();
  const absPath = path.resolve(workingDir, pathToFile);
  return fs.readFileSync(absPath, 'utf8');
}

const getFileType = (filePath) => path.extname(filePath).replace(/(\.)/, '');

function parse(value, data) {
  const parserFile = getParser(getFileType(value));
  return parserFile(data);
}

export default function genDiff(path1, path2, formatName = 'stylish') {
  const file1 = readFile(path1);
  const file2 = readFile(path2);

  const data1 = parse(path1, file1);
  const data2 = parse(path2, file2);

  const dataTree = buildDataTree(data1, data2);
  const formatter = getFormatter(formatName);
  return formatter(dataTree);
}
