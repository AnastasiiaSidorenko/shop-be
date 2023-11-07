import { SQSEvent } from "aws-lambda";
import { formatJSONResponse } from '@libs/api-gateway';
import { StatusCode } from 'src/models/StatusCode';
import { ProductService } from 'src/service/ProductService';

export const catalogBatchProcess = async (event: SQSEvent) => {
    console.log("'catalogBatchProcess' lambda was called: ", event);

    const parsedRecords = [];

    for (const record of event.Records) {
        const body = JSON.parse(record.body);
        parsedRecords.push(body);
    }

    try {
        await ProductService.createProductsBatchProcess(parsedRecords);
        await ProductService.sendMessages(parsedRecords);
    } catch (error) {
        return formatJSONResponse(StatusCode.INTERNAL_SERVER_ERROR, {
            message: `Internal server error`,
        });
    }
};