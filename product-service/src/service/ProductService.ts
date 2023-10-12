import { productMocks } from "src/mocks/productMocks";

export const ProductService = {
    getProducts: () => Promise.resolve(productMocks)
};