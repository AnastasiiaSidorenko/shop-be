import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { StatusCode } from 'src/models/StatusCode';
import { ImportService } from 'src/service/ImportService';

const importFileParser = async (event) => {
  console.log("'importFileParser' lambda was called: ", event);

  try {
    for (let record of event.Records) {
      await ImportService.importFileParser(record);
    }
  } catch (error) {
    return formatJSONResponse(StatusCode.INTERNAL_SERVER_ERROR, {
      message: `Internal server error`,
    });
  }
};

export const main = middyfy(importFileParser);
