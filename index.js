#!/usr/bin/env node
import { Command } from 'commander';
import genDiff from './src/gendiff.js';

const program = new Command();

program
  .description('Compares two configuration files and shows a difference.')
  // .option('-h, --help', 'output extra debugging')
  .option('-f, --format [type]', 'output format')
  .arguments('<filepath1>')
  .arguments('<filepath2>')
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
  })
  .parse(process.argv);
