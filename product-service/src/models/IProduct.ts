export interface IProduct extends IProductDB {
    count: number;
  }

export interface IProductDB {
    id: string;
    description: string;
    price: number;
    title: string;
}

export interface IStockDB {
    product_id: string;
    count: number;
}