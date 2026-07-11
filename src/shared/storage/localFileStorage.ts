import { randomUUID } from 'crypto';
import { mkdir, readFile, rm, writeFile } from 'fs/promises';
import path from 'path';

import { FileStorage, StoreFileInput } from './fileStorage';

class LocalFileStorage implements FileStorage {
  constructor(private readonly rootDirectory: string) {}

  async store({ data, extension }: StoreFileInput) {
    await mkdir(this.rootDirectory, { recursive: true });

    const key = `${randomUUID()}${extension}`;
    await writeFile(this.resolveKey(key), data, { flag: 'wx' });

    return { key };
  }

  read(key: string) {
    return readFile(this.resolveKey(key));
  }

  async delete(key: string) {
    await rm(this.resolveKey(key), { force: true });
  }

  private resolveKey(key: string) {
    return path.join(this.rootDirectory, path.basename(key));
  }
}

export { LocalFileStorage };
