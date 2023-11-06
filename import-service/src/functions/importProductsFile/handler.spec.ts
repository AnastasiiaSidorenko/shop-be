import { ImportService } from "src/service/ImportService";
import { importProductsFile } from "./handler";

describe('importProductsFile', () => {
    it('should return internal server error', async () => {
        const event = {
            queryStringParameters: {
                name: 'test'
            }
        };

        jest.spyOn(ImportService, 'generatePresignedUrl').mockRejectedValue('error');

        const result = await importProductsFile(event);

        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body).message).toBe('Internal server error');
    });

    it('should return bad request message', async () => {
        const event = {
            queryStringParameters: {}
        };

        const result = await importProductsFile(event);

        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body).message).toBe('Bad request');
    });

    it('should return presigned url and successful response', async () => {
        const event = {
            queryStringParameters: {
                name: 'test'
            }
        };

        const signedUrl = 'signedUrl'

        jest
            .spyOn(ImportService, 'generatePresignedUrl')
            .mockImplementation(() => Promise.resolve(signedUrl));

        const result = await importProductsFile(event);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toBe(signedUrl);
    });
});