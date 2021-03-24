#!/usr/bin/env node
import { Command } from 'commander/esm.mjs';
import genDiff from './src/gendiff.js';

const program = new Command();

program.version('0.0.1');
program
  .arguments('<filepath1>')
  .arguments('<filepath2>')
  .description('Compares two configuration files and shows a difference.')
  .option('-h, --help', 'output extra debugging')
  .option('-f, --format [type]', 'output format')
  .action(() => {
    if (program.opts().help) {
      program.help('Compares two configuration files and shows a difference.');
    }

    if (program.args) {
      const { format: formatName } = program.opts();
      const [file1, file2] = program.args;
      const diff = genDiff(file1, file2, formatName);
      console.log(diff);
    }
  });

program.parse();

export default genDiff;
