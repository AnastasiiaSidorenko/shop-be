import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { IProduct } from 'src/models/IProduct';
import { StatusCode } from 'src/models/StatusCode';
import { ProductService } from 'src/service/ProductService';

export const getProductsList = async () => {
  try {
    const products: IProduct[] = await ProductService.getProductsList();

    if (products.length) {
      return formatJSONResponse(StatusCode.OK, products);
    }

    return formatJSONResponse(StatusCode.NOT_FOUND, {
      message: `Products not found`,
    });

  } catch (error) {
    return formatJSONResponse(StatusCode.INTERNAL_SERVER_ERROR, {
      message: `Internal server error`,
    });
  }
};

export const main = middyfy(getProductsList);
