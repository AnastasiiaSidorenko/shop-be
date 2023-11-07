import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand, GetCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { IProduct } from "src/models/IProduct";

const dbClient = new DynamoDBClient({ region: 'eu-west-1' });

const getTransactItems = (products: IProduct[]) => {
const result = [];

products.forEach((product) => {
    const { id, title, price, count, description } = product;

    result.push(
        {
            Put: {
                Item: {
                    id,
                    title,
                    description,
                    price,
                },
                TableName: process.env.PRODUCTS_TABLE_NAME,
            },
        },
        {
            Put: {
                Item: {
                    product_id: id,
                    count,
                },
                TableName: process.env.STOCKS_TABLE_NAME,
            },
        },
    );
});

return result;

};

export const getTableData = async (tableName: string) => {
    const command = new ScanCommand({
        TableName: tableName
    });

    const response = (await dbClient.send(command)).Items;
    return response;
};

export const getItemByKey = async (tableName: string, key: string, value: string) => {
    const command = new GetCommand({
        TableName: tableName,
        Key: {
            [key]: value,
        },
    });

    const response = (await dbClient.send(command)).Item;

    return response;
};

export const createProduct = async (data: IProduct) => {
    const command = new TransactWriteCommand({
        TransactItems: getTransactItems([data]),
    });

    await dbClient.send(command);

    return data;
};

export const createProductsBatchProcess = async (data: IProduct[]) => {
    const command = new TransactWriteCommand({
        TransactItems: getTransactItems(data),
    });
    
    await dbClient.send(command);
};