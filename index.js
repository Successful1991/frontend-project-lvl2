import path from 'path';
import fs from 'fs';
// import { fileURLToPath } from 'url';
import getParser from './src/parsers.js';
import buildAst from './src/buildAst.js';
import getFormattingHandler from './src/formatters/index.js';

function getFullPath(pathToFile) {
  const workingDir = process.cwd();
  const absPath = path.resolve(workingDir, pathToFile);
  return absPath;
  // const __filename = fileURLToPath(import.meta.url);
  // const __dirname = path.dirname(__filename);
  // return path.join(__dirname, fileName);
  // return path.join(__dirname, '__fixtures__', fileName);
}

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

const getTypeFile = (filePath) => path.extname(filePath);

function genDiff(path1, path2, formatName) {
  const parserPath1 = getParser(getTypeFile(path1));
  const parserPath2 = getParser(getTypeFile(path2));

  const file1 = readFile(getFullPath(path1));
  const file2 = readFile(getFullPath(path2));

  const before = parserPath1(file1);
  const after = parserPath2(file2);

  const ast = buildAst(before, after);
  const formattingHandler = getFormattingHandler(formatName);

  return formattingHandler(ast);
}

export default genDiff;
