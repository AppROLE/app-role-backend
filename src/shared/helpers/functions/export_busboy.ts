import Busboy from 'busboy';

export async function parseMultipartFormData(
  request: Record<string, any>
): Promise<{
  files: Record<string, { image: Buffer; mimetype: string }>;
  fields: Record<string, any>;
}> {
  console.info('parseMultipartFormDataRequest:', request);
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

  const result: {
    files: Record<string, { image: Buffer; mimetype: string }>;
    fields: Record<string, any>;
  } = {
    files: {},
    fields: {},
  };

  let fileIndex = 1;

  return new Promise((resolve, reject) => {
    try {
      busboy.on('file', (fieldname, file, infos) => {
        const { mimeType } = infos;
        const chunks: Buffer[] = [];
        const fileKey = `${fieldname}_${fileIndex}`;
        fileIndex += 1;

        file
          .on('data', (chunk: Buffer) => {
            chunks.push(chunk);
          })
          .on('end', () => {
            const completeFile = Buffer.concat(chunks);
            result.files[fileKey] = {
              image: completeFile,
              mimetype: mimeType,
            };
          });
      });

      busboy.on('field', (fieldname, val) => {
        result.fields[fieldname] = val;
      });

      busboy.on('finish', () => {
        resolve(result);
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
