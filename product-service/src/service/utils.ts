import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand, GetCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";

const dbClient = new DynamoDBClient({ region: 'eu-west-1' });

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

export const createProduct = async (
    id: string,
    title: string,
    price: number,
    count: number,
    description: string,
    productsTableName: string,
    stocksTableName: string
) => {
    const command = new TransactWriteCommand({
        TransactItems: [
            {
                Put: {
                    Item: {
                        id,
                        title,
                        description,
                        price,
                    },
                    TableName: productsTableName,
                },
            },
            {
                Put: {
                    Item: {
                        product_id: id,
                        count,
                    },
                    TableName: stocksTableName,
                },
            },
        ],
    });

    await dbClient.send(command);

    return { id, title, price, count, description };
};