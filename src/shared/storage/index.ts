import path from 'path';

import { appConfig } from '../../config/appConfig';
import { FileStorage } from './fileStorage';
import { LocalFileStorage } from './localFileStorage';

const createFileStorage = (): FileStorage => {
  if (appConfig.fileStorage.driver === 'local') {
    return new LocalFileStorage(path.resolve(appConfig.fileStorage.localRoot));
  }

  throw new Error(`Unsupported file storage driver: ${appConfig.fileStorage.driver}`);
};

const fileStorage = createFileStorage();

export { fileStorage };
export type { FileStorage } from './fileStorage';
