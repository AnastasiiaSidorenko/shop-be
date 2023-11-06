import { v4 as uuidv4 } from "uuid";
import { createProduct, getItemByKey, getTableData } from "./utils";
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
        const { title, price, count, description } = body;

        const newProduct = await createProduct(
            id,
            title,
            price,
            count,
            description,
            process.env.PRODUCTS_TABLE_NAME,
            process.env.STOCKS_TABLE_NAME
        );

        return newProduct;
    },
};