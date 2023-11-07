import { v4 as uuidv4 } from "uuid";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { createProduct, createProductsBatchProcess, getItemByKey, getTableData } from "./utils";
import { IProduct, IProductDB, IStockDB } from "src/models/IProduct";

export const ProductService = {
    getProductsList: async () => {
        const productsTableData = await getTableData(
            process.env.PRODUCTS_TABLE_NAME
        ) as IProductDB[];

        const stocksTableData = await getTableData(
            process.env.STOCKS_TABLE_NAME
        ) as IStockDB[];

        const joinedProductInfo: IProduct[] = productsTableData.map((productItem) => ({
            ...productItem,
            count: stocksTableData.find((stockItem) => stockItem.product_id === productItem.id).count,
        }));

        return joinedProductInfo;
    },

    getProductById: async (id: string) => {
        const product = (await getItemByKey(
            process.env.PRODUCTS_TABLE_NAME,
            "id",
            id
        )) as IProductDB;

        if (!product) {
            return null;
        }

        const stock = (await getItemByKey(
            process.env.STOCKS_TABLE_NAME,
            "product_id",
            id
        )) as IStockDB;

        const joinedProduct: IProduct = {
            ...product,
            count: stock.count,
        };

        return joinedProduct;
    },

    createProduct: async (body) => {
        const id: string = uuidv4();

        const newProduct = await createProduct({
            id,
            ...body
        });

        return newProduct;
    },

    createProductsBatchProcess: async (products) => {
        const id: string = uuidv4();

        const productItems: IProduct[] = products.map((product) => ({
            id,
            ...product,
        }));

        await createProductsBatchProcess(productItems);
    },

    sendMessages: async (products) => {
        const snsClient = new SNSClient({ region: "eu-west-1" });

        for (const product of products) {
            const sqsCommand = new PublishCommand({
                Subject: `Product "${product.title}" was created`,
                Message: JSON.stringify(product),
                MessageAttributes: {
                    productPrice: {
                        DataType: "Number",
                        StringValue: `${product.price}`,
                    },
                },
                TopicArn: process.env.SNS_ARN,
            });

            await snsClient.send(sqsCommand);
        }
    },
};