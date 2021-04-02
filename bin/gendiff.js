#!/usr/bin/env node

import program from 'commander';
import genDiff from '../src/genDiff.js';

program
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .arguments('<filepath1> <filepath2>')
  .action((file1, file2, option) => {
    console.log(genDiff(file1, file2, option.format));
  });

program.parse(process.argv);
