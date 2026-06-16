import fs from 'fs';
import { writeObject } from '../repository.js';

export function hashBlob(filePath) {
  const data = fs.readFileSync(filePath);
  return writeObject(data);
}
