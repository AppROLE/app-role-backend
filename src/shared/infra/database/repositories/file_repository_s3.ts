import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  DeleteObjectsCommand,
  GetObjectCommand,
  GetObjectCommandInput,
  ListObjectsV2Command,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { Environments } from "src/shared/environments";
import { Readable } from "stream";
import sharp from "sharp";
import { S3Exception } from "src/shared/helpers/errors/base_error";
import { IFileRepository } from "src/shared/domain/repositories/file_repository_interface";

export class FileRepositoryS3 implements IFileRepository {
  s3BucketName: string;
  s3Client: S3Client;

  constructor() {
    this.s3BucketName = Environments.s3BucketName;
    this.s3Client = new S3Client({
      region: Environments.region,
    });
  }

  async compressImage(image: Buffer, mimetype: string): Promise<Buffer> {
    try {
      return await sharp(image)
        .resize({ width: 1024 })
        .jpeg({ quality: 90 })
        .toBuffer();
    } catch (error: any) {
      throw new S3Exception(`Error on compressImage: ${error.message}`);
    }
  }

  async deleteImage(pathName: string): Promise<void> {
    try {
      const params: DeleteObjectCommandInput = {
        Bucket: this.s3BucketName,
        Key: pathName,
      };

      await this.s3Client.send(new DeleteObjectCommand(params));
    } catch (error: any) {
      throw new S3Exception(`deleteProfilePhoto - ${error.message}`);
    }
  }

  async uploadImage(
    imagePathName: string,
    image: Buffer,
    mimetype: string,
    isCompressed: boolean = false
  ): Promise<string> {
    try {
      if (!isCompressed) {
        image = await this.compressImage(image, mimetype);
      }

      const params: PutObjectCommandInput = {
        Bucket: this.s3BucketName,
        Key: imagePathName,
        Body: image,
        ContentType: mimetype,
      };

      await this.s3Client.send(new PutObjectCommand(params));

      return `https://${this.s3BucketName}.s3.amazonaws.com/${imagePathName}`;
    } catch (error: any) {
      throw new S3Exception(`uploadProfilePhoto - ${error.message}`);
    }
  }

  async updateimagePathName(
    pathName: string,
    newPathName: string
  ): Promise<string | undefined> {
    try {
      const params: GetObjectCommandInput = {
        Bucket: this.s3BucketName,
        Key: pathName,
      };

      const { Body } = await this.s3Client.send(new GetObjectCommand(params));

      if (!Body) return undefined;

      const bodyBuffer = await this.bodyToBuffer(Body as Readable);

      const paramsUpdate: PutObjectCommandInput = {
        Bucket: this.s3BucketName,
        Key: newPathName,
        Body: bodyBuffer,
      };

      await this.s3Client.send(new PutObjectCommand(paramsUpdate));

      const paramsDelete: DeleteObjectCommandInput = {
        Bucket: this.s3BucketName,
        Key: pathName,
      };

      await this.s3Client.send(new DeleteObjectCommand(paramsDelete));

      return `https://${this.s3BucketName}.s3.amazonaws.com/${newPathName}`;
    } catch (error: any) {
      throw new S3Exception(`updateKeyProfilePhoto - ${error.message}`);
    }
  }

  async deleteFolder(folderPath: string): Promise<void> {
    try {
      if (!folderPath.endsWith("/")) {
        folderPath += "/";
      }

      const listedObjects = await this.s3Client.send(
        new ListObjectsV2Command({
          Bucket: this.s3BucketName,
          Prefix: folderPath,
        })
      );

      if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
        console.log(`Nenhum objeto encontrado em ${folderPath}`);
        return;
      }

      const deleteParams = {
        Bucket: this.s3BucketName,
        Delete: {
          Objects: listedObjects.Contents.map((object) => ({
            Key: object.Key!,
          })),
          Quiet: false,
        },
      };

      await this.s3Client.send(new DeleteObjectsCommand(deleteParams));

      if (listedObjects.IsTruncated) {
        await this.deleteFolder(folderPath);
      }

      console.log(`Pasta "${folderPath}" apagada com sucesso.`);
    } catch (error: any) {
      throw new S3Exception(`deleteFolder - ${error.message}`);
    }
  }

  private async bodyToBuffer(body: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      body.on("data", (chunk: Uint8Array) => chunks.push(chunk));
      body.on("end", () => resolve(Buffer.concat(chunks)));
      body.on("error", reject);
    });
  }
}
