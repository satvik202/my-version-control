#!/usr/bin/env node
import { program } from 'commander';
import { registerInit } from '../src/commands/init.js';

program.name('myvcs').version('0.1.0');

registerInit(program);

program.parse();
