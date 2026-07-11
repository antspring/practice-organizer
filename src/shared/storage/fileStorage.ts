type StoreFileInput = {
  data: Buffer;
  extension: string;
};

type StoredFile = {
  key: string;
};

interface FileStorage {
  store(input: StoreFileInput): Promise<StoredFile>;
  read(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
}

export { FileStorage, StoreFileInput, StoredFile };
