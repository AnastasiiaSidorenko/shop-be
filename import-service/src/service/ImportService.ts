import { S3 } from 'aws-sdk';
import { S3EventRecord } from 'aws-lambda';

const csv = require('csv-parser');

export const ImportService = {
    generatePresignedUrl: async (fileName: string) => {
        const s3 = new S3({ region: 'eu-west-1' });

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
        const s3 = new S3({ region: 'eu-west-1' });

        const bucket = record.s3.bucket.name;
        const key = record.s3.object.key;

        const params = {
            Bucket: bucket,
            Key: key
        };

        const file = s3.getObject(params).createReadStream();

        const results = [];
        const parsedData = await new Promise((resolve, reject) => {
            file.pipe(csv())
                .on("data", (data) => {
                    console.log("Record: ", data);
                    results.push(data);
                })
                .on("end", () => {
                    resolve(results);
                })
                .on("error", () => {
                    reject(false);
                });
        });

        return parsedData;
    },
    moveFile: async(record: S3EventRecord) => {
        const s3 = new S3({ region: 'eu-west-1' });

        const bucket = record.s3.bucket.name;
        const key = record.s3.object.key;

        const params = {
            Bucket: bucket,
            Key: key
        };

        await s3.copyObject({
            CopySource: `${bucket}/${key}`,
            Bucket: bucket,
            Key: key.replace(process.env.UPLOADED_FILES_FOLDER, process.env.PARSED_FILES_FOLDER),
        }).promise();

        await s3.deleteObject(params).promise();
    }
};