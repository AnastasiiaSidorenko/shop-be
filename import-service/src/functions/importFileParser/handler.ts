import { S3Event } from 'aws-lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import { StatusCode } from 'src/models/StatusCode';
import { ImportService } from 'src/service/ImportService';

export const importFileParser = async (event: S3Event) => {
  console.log("'importFileParser' lambda was called: ", event);

  try {
    const s3Records = event.Records;

    for (const record of s3Records) {
      const parsedData = await ImportService.importFileParser(record);

      if (parsedData) {
        console.log("File successfully parsed", parsedData);
        await ImportService.moveFile(record);
      }
    }
  } catch (error) {
    return formatJSONResponse(StatusCode.INTERNAL_SERVER_ERROR, {
      message: `Internal server error`,
    });
  }
};
