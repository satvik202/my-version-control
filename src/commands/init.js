import fs from 'fs';
import path from 'path';

export function registerInit(program) {
  program
    .command('init')
    .description('Initialize a new .myvcs repository')
    .action(() => {
      const repoRoot = path.join(process.cwd(), '.myvcs');

      if (fs.existsSync(repoRoot)) {
        console.log('Already a myvcs repository.');
        return;
      }

      fs.mkdirSync(path.join(repoRoot, 'objects'), { recursive: true });
      fs.mkdirSync(path.join(repoRoot, 'refs', 'heads'), { recursive: true });
      fs.writeFileSync(path.join(repoRoot, 'HEAD'), 'ref: refs/heads/main\n');

      console.log(`Initialized empty myvcs repository in ${repoRoot}`);
    });
}
