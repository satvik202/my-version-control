import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import zlib from 'zlib';

export function findRepoRoot() {
  let dir = process.cwd();

  while (true) {
    if (fs.existsSync(path.join(dir, '.myvcs'))) return dir;

    const parent = path.dirname(dir);
    if (parent === dir) throw new Error('Not a myvcs repository');
    dir = parent;
  }
}

export function writeObject(data) {
  const sha = crypto.createHash('sha1').update(data).digest('hex');

  const repoRoot = findRepoRoot();
  const folder = sha.slice(0, 2);
  const file = sha.slice(2);
  const objectDir = path.join(repoRoot, '.myvcs', 'objects', folder);

  fs.mkdirSync(objectDir, { recursive: true });

  const objectPath = path.join(objectDir, file);
  if (!fs.existsSync(objectPath)) {
    fs.writeFileSync(objectPath, zlib.deflateSync(data));
  }

  return sha;
}

export function readObject(sha) {
  const repoRoot = findRepoRoot();
  const objectPath = path.join(repoRoot, '.myvcs', 'objects', sha.slice(0, 2), sha.slice(2));

  if (!fs.existsSync(objectPath)) {
    throw new Error(`Object not found: ${sha}`);
  }

  return zlib.inflateSync(fs.readFileSync(objectPath));
}
