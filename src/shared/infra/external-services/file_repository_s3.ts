import { S3 } from "aws-sdk";
import { IFileRepository } from "src/shared/domain/repositories/file_repository_interface";
import { Environments } from "src/shared/environments";
import { S3Exception } from "src/shared/helpers/errors/base_error";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";

export class FileRepositoryS3 implements IFileRepository {
  private readonly s3BucketName: string;

  constructor() {
    this.s3BucketName = Environments.s3BucketName;
  }

  async uploadEventPhoto(
    imageNameKey: string,
    eventPhoto: Buffer,
    mimetype: string
  ): Promise<void> {
    try {
      const s3 = new S3();
      const params: S3.PutObjectRequest = {
        Bucket: this.s3BucketName,
        Key: imageNameKey,
        Body: eventPhoto,
        ContentType: mimetype,
      };

      await s3.putObject(params).promise();
    } catch (error: any) {
      throw new S3Exception(`uploadEventPhoto - ${error.message}`);
    }
  }

  async uploadInstitutePhoto(
    imageNameKey: string,
    institutePhoto: Buffer,
    mimetype: string
  ): Promise<void> {
    try {
      const s3 = new S3();
      const params: S3.PutObjectRequest = {
        Bucket: this.s3BucketName,
        Key: imageNameKey,
        Body: institutePhoto,
        ContentType: mimetype,
      };

      await s3.putObject(params).promise();
    } catch (error: any) {
      throw new S3Exception(`uploadEventPhoto - ${error.message}`);
    }
  }

  async uploadEventGalleryPhoto(
    imageNameKey: string,
    eventPhoto: Buffer,
    mimetype: string
  ): Promise<void> {
    try {
      const s3 = new S3();
      const params: S3.PutObjectRequest = {
        Bucket: this.s3BucketName,
        Key: imageNameKey,
        Body: eventPhoto,
        ContentType: mimetype,
      };

      await s3.putObject(params).promise();
    } catch (error: any) {
      throw new S3Exception(`uploadEventPhoto - ${error.message}`);
    }
  }

  async uploadEventBanner(
    imageNameKey: string,
    eventPhoto: Buffer,
    mimetype: string
  ): Promise<void> {
    try {
      const s3 = new S3();
      const params: S3.PutObjectRequest = {
        Bucket: this.s3BucketName,
        Key: imageNameKey,
        Body: eventPhoto,
        ContentType: mimetype,
      };

      await s3.putObject(params).promise();
    } catch (error: any) {
      throw new S3Exception(`uploadEventBanner - ${error.message}`);
    }
  }

  async deleteEventPhotoByEventId(eventId: string): Promise<void> {
    try {
      const s3 = new S3();

      if (!eventId) {
        throw new Error("Event ID não fornecido.");
      }

      const listParams: S3.ListObjectsV2Request = {
        Bucket: this.s3BucketName,
        Prefix: `events/${eventId}/`,
      };

      const listedObjects = await s3.listObjectsV2(listParams).promise();

      if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
        throw new NoItemsFound("pasta do evento");
      }

      const eventPhoto = listedObjects.Contents.find(
        (file) => file.Key && file.Key.includes("event-photo")
      );

      if (!eventPhoto) {
        throw new NoItemsFound("foto do evento");
      }

      const deleteParams: S3.DeleteObjectRequest = {
        Bucket: this.s3BucketName,
        Key: eventPhoto.Key!,
      };

      await s3.deleteObject(deleteParams).promise();
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        throw new NoItemsFound(error.message);
      }
      throw new S3Exception(`deleteEventPhotoByEventId - ${error.message}`);
    }
  }

  async deleteInstitutePhoto(name: string): Promise<void> {
    try {
      const s3 = new S3();

      if (!name) {
        throw new Error("InstituteName não fornecido.");
      }

      const listParams: S3.ListObjectsV2Request = {
        Bucket: this.s3BucketName,
      };

      const listedObjects = await s3.listObjectsV2(listParams).promise();

      if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
        throw new Error("Nenhum arquivo encontrado no bucket.");
      }

      const matchingFiles = listedObjects.Contents.filter((file) =>
        file.Key?.includes(`${name.replace(" ", "-")}-logo`)
      );

      if (matchingFiles.length === 0) {
        throw new NoItemsFound("foto do evento");
      }

      const deletePromises = matchingFiles.map(async (file) => {
        const deleteParams: S3.DeleteObjectRequest = {
          Bucket: this.s3BucketName,
          Key: file.Key!,
        };

        await s3.deleteObject(deleteParams).promise();
      });

      await Promise.all(deletePromises);
    } catch (error: any) {
      throw new S3Exception(`deleteInstitutePhoto - ${error.message}`);
    }
  }

  async deleteGallery(eventId: string): Promise<void> {
    try {
      const s3 = new S3();

      if (!eventId) {
        throw new Error("Event ID não fornecido.");
      }

      const galleryPrefix = `events/${eventId}/gallery/`;

      const listParams: S3.ListObjectsV2Request = {
        Bucket: this.s3BucketName,
        Prefix: galleryPrefix,
      };

      const listedObjects = await s3.listObjectsV2(listParams).promise();

      if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
        throw new Error(`Nenhum arquivo encontrado na pasta ${galleryPrefix}.`);
      }

      const deleteParams: S3.DeleteObjectsRequest = {
        Bucket: this.s3BucketName,
        Delete: {
          Objects: listedObjects.Contents.map((file) => ({ Key: file.Key! })),
        },
      };

      await s3.deleteObjects(deleteParams).promise();
    } catch (error: any) {
      throw new S3Exception(`deleteGallery - ${error.message}`);
    }
  }

  async deleteEventBanner(eventId: string): Promise<void> {
    try {
      const s3 = new S3();

      if (!eventId) {
        throw new Error("Event ID não fornecido.");
      }

      const bannerPrefix = `events/${eventId}/banner`;

      const listParams: S3.ListObjectsV2Request = {
        Bucket: this.s3BucketName,
        Prefix: `events/${eventId}/`,
      };

      const listedObjects = await s3.listObjectsV2(listParams).promise();

      if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
        throw new S3Exception("Nenhum arquivo encontrado na pasta do evento.");
      }

      const bannerFile = listedObjects.Contents.find(
        (file) => file.Key && file.Key.startsWith(bannerPrefix)
      );

      if (!bannerFile) {
        throw new S3Exception(
          "Nenhum arquivo banner encontrado na pasta do evento."
        );
      }

      const deleteParams: S3.DeleteObjectRequest = {
        Bucket: this.s3BucketName,
        Key: bannerFile.Key!,
      };

      await s3.deleteObject(deleteParams).promise();
    } catch (error: any) {
      throw new S3Exception(`deleteEventBanner - ${error.message}`);
    }
  }
}
