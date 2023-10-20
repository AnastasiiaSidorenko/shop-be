import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { IProduct } from 'src/models/IProduct';
import { StatusCode } from 'src/models/StatusCode';
import { ProductService } from 'src/service/ProductService';

export const getProductById = async (event) => {
    console.log("'getProductById' lambda was called: ", event);

    const { productId } = event.pathParameters;
    try {
        const product: IProduct = await ProductService.getProductById(productId);

        if (product) {
            return formatJSONResponse(StatusCode.OK, product);
        }

        return formatJSONResponse(StatusCode.NOT_FOUND, {
            message: `Product not found`,
        });
    } catch (error) {
        return formatJSONResponse(StatusCode.INTERNAL_SERVER_ERROR, {
            message: `Internal server error`,
        });
    }
};

export const main = middyfy(getProductById);