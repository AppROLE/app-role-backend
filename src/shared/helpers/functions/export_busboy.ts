import Busboy from 'busboy';

export type ParsedFile = { image: Buffer; mimetype: string };

export interface FormData<TFields = Record<string, unknown>> {
  files: Record<string, ParsedFile | ParsedFile[]>;
  fields: TFields;
}

export async function parseMultipartFormData<TFields = Record<string, unknown>>(
  request: Record<string, any>
): Promise<FormData<TFields>> {
  const contentType =
    request.headers['content-type'] || request.headers['Content-Type'];
  if (!contentType || !contentType.includes('multipart/form-data')) {
    throw new Error('Content-Type da requisição não é multipart/form-data');
  }

  const busboy = Busboy({
    headers: {
      'content-type': contentType,
    },
  });

  const result: FormData = {
    files: {},
    fields: {},
  };

  return new Promise<FormData<TFields>>((resolve, reject) => {
    try {
      busboy.on('file', (fieldname, file, infos) => {
        const { mimeType } = infos;
        const chunks: Buffer[] = [];

        file
          .on('data', (chunk: Buffer) => {
            chunks.push(chunk);
          })
          .on('end', () => {
            const completeFile = Buffer.concat(chunks);
            if (!result.files[fieldname]) {
              result.files[fieldname] = [];
            }
            if (Array.isArray(result.files[fieldname])) {
              (result.files[fieldname] as ParsedFile[]).push({
                image: completeFile,
                mimetype: mimeType,
              });
            }
          });
      });

      busboy.on('field', (fieldname, val) => {
        result.fields[fieldname] = val;
      });

      busboy.on('finish', () => {
        resolve(result as FormData<TFields>);
      });

      busboy.on('error', (error) => {
        reject(error);
      });

      const body = request.isBase64Encoded
        ? Buffer.from(request.body, 'base64')
        : Buffer.from(request.body, 'utf-8');

      busboy.end(body);
    } catch (err) {
      reject(err);
    }
  });
}
