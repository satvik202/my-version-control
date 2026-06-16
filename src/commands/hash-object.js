import { hashBlob } from '../objects/blob.js';

export function registerHashObject(program) {
  program
    .command('hash-object <file>')
    .description('Compute and store the SHA of a file as a blob')
    .action((file) => {
      const sha = hashBlob(file);
      console.log(sha);
    });
}
