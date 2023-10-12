import { IProduct } from "src/models/IProduct"

export const formatJSONResponse = (statusCode, response: IProduct[]) => {
  console.log(response);
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(response)
  }
}
