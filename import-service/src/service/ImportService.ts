import { S3 } from 'aws-sdk';
import { S3EventRecord } from 'aws-lambda';

const csv = require('csv-parser');
const s3 = new S3({ region: 'eu-west-1' });
const S3_OBJECT_KEY_SEPARATOR = '/';
const CSV_PARSER_SEPARATOR = ',';

export const ImportService = {
    generatePresignedUrl: async (fileName: string) => {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `${process.env.UPLOADED_FILES_FOLDER}/${fileName}`,
            Expires: 60,
            ContentType: 'text/csv'
        };

        const signedURL = await s3.getSignedUrlPromise('putObject', params);
        return signedURL;
    },
    importFileParser: async (record: S3EventRecord) => {
        const [, file] = record.s3.object.key.split(S3_OBJECT_KEY_SEPARATOR);
        const params = {
            Bucket: record.s3.bucket.name,
            Key: record.s3.object.key
        };
        const streamS3Response = s3.getObject(params).createReadStream();
        const data = streamS3Response.pipe(csv({ separator: CSV_PARSER_SEPARATOR }));
        const chunks = [];

        for await (const chunk of data) {
            chunks.push(chunk);
        }

        await s3.putObject({
            Bucket: record.s3.bucket.name,
            Body: JSON.stringify(chunks),
            Key: `${process.env.PARSED_FILES_FOLDER}/${file.replace('csv', 'json')}`,
            ContentType: 'application/json'
        }).promise();

        await s3.deleteObject(params).promise();

        console.log(record)
    },
};