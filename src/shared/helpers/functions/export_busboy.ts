import Busboy from "busboy";

export async function parseMultipartFormData(
  request: Record<string, any>
): Promise<Record<string, any>> {
  const contentType =
    request.headers["content-type"] || (request.headers["Content-Type"] as any);
  if (!contentType || !contentType.includes("multipart/form-data")) {
    throw new Error("Content-Type da requisição não é multipart/form-data");
  }

  const contentLength =
    request.headers["content-length"] || request.headers["Content-Length"];

  const busboy = Busboy({
    headers: {
      "content-type": contentType,
      "content-length": contentLength,
    },
  });
  const result: Record<string, any> = {
    files: [],
    fields: {},
  };

  return new Promise((resolve, reject) => {
    busboy.on("file", (fieldname: any, file: any, infos: any) => {
      const { filename, encoding, mimeType } = infos;

      const chunks: Buffer[] = [];

      file
        .on("data", (chunk: Buffer) => {
          chunks.push(chunk);
        })

        .on("end", () => {
          const completeFile = Buffer.concat(chunks);
          // Garante que o arquivo foi completamente recebido
          result.files.push({
            fieldname,
            filename,
            encoding,
            mimeType,
            data: completeFile,
          });
        });
    });

    busboy.on("field", (fieldname: any, val: any) => {
      result.fields[fieldname] = val;
    });

    busboy.on("finish", () => {
      resolve(result);
    });

    busboy.on("error", (error: any) => {
      reject(error);
    });

    const body = request.isBase64Encoded
      ? Buffer.from(request.body, "base64")
      : request.body;
    busboy.write(body);
    busboy.end();
  });
}
