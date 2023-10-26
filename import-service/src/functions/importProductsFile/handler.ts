import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { StatusCode } from 'src/models/StatusCode';
import { ImportService } from 'src/service/ImportService';

const importProductsFile = async (event) => {
  console.log("'importProductsFile' lambda was called: ", event);

  try {
    const { name } = event.queryStringParameters;

    if (!name) {
      return formatJSONResponse(StatusCode.BAD_REQUEST, {
        message: `Bad request`,
      });
    }

    const signedUrl: string = await ImportService.generatePresignedUrl(name);

    return formatJSONResponse(StatusCode.OK, signedUrl);
  } catch (error) {
    return formatJSONResponse(StatusCode.INTERNAL_SERVER_ERROR, {
      message: `Internal server error`,
    });
  }
};

export const main = middyfy(importProductsFile);
