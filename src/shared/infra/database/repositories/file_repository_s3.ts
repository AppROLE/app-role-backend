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
} from '@aws-sdk/client-s3';
import { Environments } from 'src/shared/environments';
import { Readable } from 'stream';
import sharp from 'sharp';
import {
  RecognitionError,
  S3Exception,
} from 'src/shared/helpers/errors/errors';
import { IFileRepository } from 'src/shared/domain/repositories/file_repository_interface';
import {
  RekognitionClient,
  DetectModerationLabelsCommand,
} from '@aws-sdk/client-rekognition';

export class FileRepositoryS3 implements IFileRepository {
  bucketName: string;
  s3Client: S3Client;
  rekognitionClient: RekognitionClient;

  constructor() {
    this.bucketName = Environments.bucketName;
    this.s3Client = new S3Client({
      region: Environments.region,
    });
    this.rekognitionClient = new RekognitionClient({
      region: 'us-east-1',
    });
  }

  async validateImageContent(image: Buffer): Promise<void> {
    try {
      const params = {
        Image: {
          Bytes: image,
        },
      };

      const command = new DetectModerationLabelsCommand(params);
      const response = await this.rekognitionClient.send(command);

      const labels = response.ModerationLabels || [];
      const inappropriateLabels = labels.filter((label) =>
        ['Explicit Nudity', 'Violence', 'Suggestive'].includes(label.Name!)
      );

      if (inappropriateLabels.length > 0) {
        throw new RecognitionError(
          ` ${inappropriateLabels.map((label) => label.Name).join(', ')}`
        );
      }
    } catch (error: any) {
      throw new S3Exception(`validateImageContent - ${error.message}`);
    }
  }

  async compressImage(image: Buffer, mimetype: string): Promise<Buffer> {
    try {
      return await sharp(image)
        .resize({ width: 1024 })
        .jpeg({ quality: 90 })
        .toBuffer();
    } catch (error: any) {
      throw new S3Exception(`compressImage - ${error.message}`);
    }
  }

  async deleteImage(pathName: string): Promise<void> {
    try {
      const params: DeleteObjectCommandInput = {
        Bucket: this.bucketName,
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
        Bucket: this.bucketName,
        Key: imagePathName,
        Body: image,
        ContentType: mimetype,
      };

      await this.s3Client.send(new PutObjectCommand(params));

      return `https://${this.bucketName}.s3.amazonaws.com/${imagePathName}`;
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
        Bucket: this.bucketName,
        Key: pathName,
      };

      const { Body } = await this.s3Client.send(new GetObjectCommand(params));

      if (!Body) return undefined;

      const bodyBuffer = await this.bodyToBuffer(Body as Readable);

      const paramsUpdate: PutObjectCommandInput = {
        Bucket: this.bucketName,
        Key: newPathName,
        Body: bodyBuffer,
      };

      await this.s3Client.send(new PutObjectCommand(paramsUpdate));

      const paramsDelete: DeleteObjectCommandInput = {
        Bucket: this.bucketName,
        Key: pathName,
      };

      await this.s3Client.send(new DeleteObjectCommand(paramsDelete));

      return `https://${this.bucketName}.s3.amazonaws.com/${newPathName}`;
    } catch (error: any) {
      throw new S3Exception(`updateKeyProfilePhoto - ${error.message}`);
    }
  }

  async deleteFolder(folderPath: string): Promise<void> {
    try {
      if (!folderPath.endsWith('/')) {
        folderPath += '/';
      }

      const listedObjects = await this.s3Client.send(
        new ListObjectsV2Command({
          Bucket: this.bucketName,
          Prefix: folderPath,
        })
      );

      if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
        console.log(`Nenhum objeto encontrado em ${folderPath}`);
        return;
      }

      const deleteParams = {
        Bucket: this.bucketName,
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
      body.on('data', (chunk: Uint8Array) => chunks.push(chunk));
      body.on('end', () => resolve(Buffer.concat(chunks)));
      body.on('error', reject);
    });
  }
}
