import { BlockBlobClient, BlobServiceClient } from '@azure/storage-blob';
import { AppConfig } from 'src/config/app.config';

export interface IBlobFile {
  name: string;
  url: string;
}

export const uploadFileToBlobStorage = async (
  blobContainerName: string,
  fileName: string,
  fileBuffer: Buffer,
): Promise<void> => {
  try {
    const storageConnectionString = AppConfig().storageConnectionString;
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      storageConnectionString,
    );
    const containerClient =
      blobServiceClient.getContainerClient(blobContainerName);
    const createdNewContainer = await containerClient.createIfNotExists();
    if (createdNewContainer.succeeded) {
      console.log(
        `The container "${blobContainerName}" was created, because it did not exist`,
      );
    }
    const blobService = new BlockBlobClient(
      storageConnectionString,
      blobContainerName,
      fileName,
    );
    // Upload data to blob storage
    await blobService.uploadData(fileBuffer);
  } catch (error) {
    console.log(
      `Error uploading file ${fileName} to Azure Blob storage`,
      error,
    );
  }
};

export const getFilesInBlobStorage = async (
  blobContainerName: string,
): Promise<IBlobFile[]> => {
  const storageConnectionString = AppConfig().storageConnectionString;
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    storageConnectionString,
  );
  const containerClient =
    blobServiceClient.getContainerClient(blobContainerName);
  const files: IBlobFile[] = [];
  for await (const blob of containerClient.listBlobsFlat()) {
    const blobClient = containerClient.getBlobClient(blob.name);
    files.push({
      name: blob.name,
      url: blobClient.url,
    });
  }
  return files;
};
