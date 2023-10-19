import { BatchWriteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { initialProductsList } from "./initialProductsList";

const client = new DynamoDBClient({ region: "eu-west-1" });

const productsRequestItems = [];
const stocksRequestItems = [];

for (const item of initialProductsList) {
  const productData = {
    PutRequest: {
      Item: {
        id: { S: item.id },
        title: { S: item.title },
        price: { N: item.price.toString() },
        description: { S: item.description },
      },
    },
  };

  productsRequestItems.push(productData);

  const stockData = {
    PutRequest: {
      Item: {
        product_id: { S: item.id },
        count: { N: item.count.toString() },
      },
    },
  };

  stocksRequestItems.push(stockData);
}

const request = {
  RequestItems: {
    Products: productsRequestItems,
    Stocks: stocksRequestItems,
  },
};

async function migrateData() {
  try {
    const command = new BatchWriteItemCommand(request);
    await client.send(command);
    console.log("All data migrated");
  } catch (err) {
    console.log("Error", err);
  }
}

migrateData();