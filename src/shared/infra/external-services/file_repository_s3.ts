import { S3 } from "aws-sdk";
import { IFileRepository } from "src/shared/domain/irepositories/file_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";

export class FileRepositoryS3 implements IFileRepository {
  s3BucketName: string;

  constructor(s3BucketName: string) {
    this.s3BucketName = s3BucketName;
  }

  async uploadEventPhoto(
    imageNameKey: string,
    eventPhoto: Buffer,
    mimetype: string
  ): Promise<void> {
    try {
      const s3 = new S3();
      console.log("s3BucketName: ", this.s3BucketName);
      const params: S3.PutObjectRequest = {
        Bucket: this.s3BucketName,
        Key: imageNameKey,
        Body: eventPhoto,
        ContentType: mimetype,
      };

      await s3.putObject(params).promise();
    } catch (error: any) {
      throw new Error(
        `FileRepositoryS3, Error on uploadEventPhoto: ${error.message}`
      );
    }
  }

  async uploadEventGalleryPhoto(
    eventId: string,
    eventName: string,
    imageNameKey: string,
    eventPhoto: Buffer,
    mimetype: string
  ): Promise<void> {
    try {
      const s3 = new S3();
      console.log("s3BucketName: ", this.s3BucketName);
      const params: S3.PutObjectRequest = {
        Bucket: this.s3BucketName,
        Key: `${eventId}+${eventName}/gallery/${imageNameKey}`,
        Body: eventPhoto,
        ContentType: mimetype,
      };

      await s3.putObject(params).promise();
    } catch (error: any) {
      throw new Error(
        `FileRepositoryS3, Error on uploadEventPhoto: ${error.message}`
      );
    }
  }

  async uploadEventBanner(
    eventId: string,
    eventName: string,
    imageNameKey: string,
    eventPhoto: Buffer,
    mimetype: string
  ): Promise<void> {
    try {
      const s3 = new S3();
      console.log("s3BucketName: ", this.s3BucketName);
      const params: S3.PutObjectRequest = {
        Bucket: this.s3BucketName,
        Key: `${eventId}+${eventName}/banner/${imageNameKey}`,
        Body: eventPhoto,
        ContentType: mimetype,
      };

      await s3.putObject(params).promise();
    } catch (error: any) {
      throw new Error(
        `FileRepositoryS3, Error on upload event banner: ${error.message}`
      );
    }
  }

  async deleteEventPhotoByEventId(eventId: string): Promise<void> {
    try {
      const s3 = new S3();
      console.log("s3BucketName: ", this.s3BucketName);

      if (!eventId) {
        throw new Error("Event ID não fornecido.");
      }

      const listParams: S3.ListObjectsV2Request = {
        Bucket: this.s3BucketName,
      };

      const listedObjects = await s3.listObjectsV2(listParams).promise();

      if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
        throw new Error("Nenhum arquivo encontrado no bucket.");
      }

      const matchingFiles = listedObjects.Contents.filter((file) =>
        file.Key?.includes(eventId)
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
        console.log(`Foto deletada com sucesso: ${file.Key}`);
      });

      await Promise.all(deletePromises);
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        throw new NoItemsFound(error.message);
      }
      throw new Error(`Erro ao deletar fotos: ${error.message}`);
    }
  }

  async deleteInstitutePhoto(name: string): Promise<void> {
    try {
      const s3 = new S3();
      console.log("s3BucketName: ", this.s3BucketName);

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
        console.log(`Foto deletada com sucesso: ${file.Key}`);
      });

      await Promise.all(deletePromises);
    } catch (error: any) {
      throw new Error(
        `FileRepositoryS3, Error on deleteInstitutePhoto: ${error.message}`
      );
    }
  }

  async deleteGallery(eventId: string): Promise<void> {
    try {
      const s3 = new S3();
      console.log("s3BucketName: ", this.s3BucketName);

      if (!eventId) {
        throw new Error("Event ID não fornecido.");
      }

      const listParams: S3.ListObjectsV2Request = {
        Bucket: this.s3BucketName,
        Prefix: `${eventId}+`, 
      };

      const listedObjects = await s3.listObjectsV2(listParams).promise();

      if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
        throw new Error("Nenhum arquivo encontrado no bucket.");
      }

      const deleteParams: S3.DeleteObjectsRequest = {
        Bucket: this.s3BucketName,
        Delete: {
          Objects: listedObjects.Contents.map((file) => ({ Key: file.Key! })),
        },
      };

      await s3.deleteObjects(deleteParams).promise();
      console.log(
        `Pasta e arquivos da galeria do evento ${eventId} deletados com sucesso.`
      );
    } catch (error: any) {
      throw new Error(`Erro ao deletar a pasta da galeria: ${error.message}`);
    }
  }
}
