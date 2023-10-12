import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { IProduct } from 'src/models/IProduct';
import { ProductService } from 'src/service/ProductService';

export const getProductsList = async (event) => {
  console.log('event', event);

  const products: IProduct[] = await ProductService.getProducts();
  console.log('products', products);

  return formatJSONResponse(200, products);
};

export const main = middyfy(getProductsList);
