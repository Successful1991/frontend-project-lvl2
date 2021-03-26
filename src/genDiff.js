import path from 'path';
import fs from 'fs';
import getParser from './parsers.js';
import buildAst from './buildAst.js';
import getFormattingHandler from './formatters/index.js';

function readFile(pathToFile) {
  const workingDir = process.cwd();
  const absPath = path.resolve(workingDir, pathToFile);
  return fs.readFileSync(absPath, 'utf8');
}

const getTypeFile = (filePath) => path.extname(filePath);

function genDiff(path1, path2, formatName) {
  const parserFile1 = getParser(getTypeFile(path1));
  const parserFile2 = getParser(getTypeFile(path2));

  const file1 = readFile(path1);
  const file2 = readFile(path2);

  const data1 = parserFile1(file1);
  const data2 = parserFile2(file2);

  const ast = buildAst(data1, data2);
  const formattingHandler = getFormattingHandler(formatName);

  return formattingHandler(ast);
}

export default genDiff;
