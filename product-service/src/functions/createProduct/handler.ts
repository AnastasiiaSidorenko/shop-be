import { object, string, number } from "yup";

import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { StatusCode } from "src/models/StatusCode";
import { IProduct } from "src/models/IProduct";
import { ProductService } from "src/service/ProductService";

const bodySchema = object({
    title: string().required(),
    price: number(),
    count: number(),
    description: string(),
});

export const createProduct = async (event) => {
    console.log("'createProduct' lambda was called: ", event);

    const body = event.body;

    const isValidBody = await bodySchema.isValid(body);

    if (!isValidBody) {
        return formatJSONResponse(StatusCode.BAD_REQUEST, {
            message: `Bad request`,
        });
    }

    try {
        const product: IProduct = await ProductService.createProduct(body);
        return formatJSONResponse(StatusCode.CREATED, product);
    } catch (error) {
        return formatJSONResponse(StatusCode.INTERNAL_SERVER_ERROR, {
            message: `Internal server error`,
        });
    }
};

export const main = middyfy(createProduct);