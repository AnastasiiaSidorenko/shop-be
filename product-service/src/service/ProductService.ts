import { productMocks } from "src/mocks/productMocks";

export const ProductService = {
    getProductsList: () => Promise.resolve(productMocks),
    getProductsById: (id: string) => {
        return Promise.resolve(productMocks.find((productItem) => productItem.id === id));
    }
};