import { ResponseType } from "src/models/ResponseType";
import { StatusCode } from "src/models/StatusCode";

export const formatJSONResponse = (statusCode: StatusCode, response: ResponseType) => {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(response)
  }
};
