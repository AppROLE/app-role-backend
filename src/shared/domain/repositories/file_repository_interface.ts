export interface IFileRepository {
  validateImageContent(image: Buffer): Promise<void>;
  uploadImage(
    imagePathName: string,
    image: Buffer,
    mimetype: string,
    isCompressed?: boolean
  ): Promise<string>;
  updateimagePathName(
    pathName: string,
    newpathName: string
  ): Promise<string | undefined>;
  deleteImage(pathName: string): Promise<void>;
  deleteFolder(folderPath: string): Promise<void>;
}
