import { Injectable } from '@nestjs/common';
import {
  getFilesInBlobStorage,
  uploadFileToBlobStorage,
} from 'src/helpers/azureStorageBlob';

@Injectable()
export class FilesService {
  async upload(file: Express.Multer.File) {
    await uploadFileToBlobStorage('images', file.originalname, file.buffer);
    return 'File upload to azure blob storage';
  }

  async list() {
    return await getFilesInBlobStorage('images');
  }
}
