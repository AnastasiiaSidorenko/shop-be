import { productMocks } from "src/mocks/productMocks";
import { ProductService } from "src/service/ProductService";
import { getProductsList } from "./handler";


describe("getProductList", () => {
    it("should return products' list", async () => {
        jest
            .spyOn(ProductService, "getProductsList")
            .mockImplementation(() => Promise.resolve(productMocks));

        const result = await getProductsList();

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual(productMocks);
    });

    it("should return 404 if products' list is empty", async () => {
        jest
            .spyOn(ProductService, "getProductsList")
            .mockImplementation(() => Promise.resolve([]));

        const result = await getProductsList();

        expect(result.statusCode).toBe(404);
        expect(JSON.parse(result.body)).toEqual({
            message: `Products not found`,
        });
    });

    it("should return 500 if the request for products' list was failed", async () => {
        jest.spyOn(ProductService, "getProductsList").mockImplementation(() => {
            throw new Error();
        });

        const result = await getProductsList();

        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body)).toEqual({
            message: `Internal server error`,
        });
    });
});