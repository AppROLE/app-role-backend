export interface IFileRepository {
  uploadImage(
    imageNameKey: string,
    image: Buffer,
    mimetype: string,
    isCompressed?: boolean
  ): Promise<string>;
  updateImageNameKey(
    imageKey: string,
    newImageKey: string
  ): Promise<string | undefined>;
  deleteImage(imageKey: string): Promise<void>;
}
