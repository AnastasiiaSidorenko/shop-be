import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const dbClient = new DynamoDBClient({ region: 'us-west-2' });

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
}