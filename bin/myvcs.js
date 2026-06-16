#!/usr/bin/env node
import { program } from 'commander';
import { registerInit } from '../src/commands/init.js';
import { registerHashObject } from '../src/commands/hash-object.js';
import { registerCatFile } from '../src/commands/cat-file.js';

program.name('myvcs').version('0.1.0');

registerInit(program);
registerHashObject(program);
registerCatFile(program);

program.parse();
