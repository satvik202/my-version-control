import { readObject } from '../repository.js';

export function registerCatFile(program) {
  program
    .command('cat-file <sha>')
    .description('Print the content of a stored object by its SHA')
    .action((sha) => {
      const data = readObject(sha);
      process.stdout.write(data);
    });
}
