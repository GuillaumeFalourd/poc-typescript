import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import {GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

export const apiGatewayEventHandler: APIGatewayProxyHandlerV2<APIGatewayProxyResultV2> = async (event: APIGatewayProxyEventV2) => {
    // e.g: reference = 3.1.0-darwin
    const { reference } = event.pathParameters as any;

    try {
        const options = {
            Bucket    : process.env.BUCKET_NAME,
            Key    : reference,
        };

        console.info('Trying to download file', reference ,'from bucket', options.Bucket);

        const client = new S3Client({});
        const command = new GetObjectCommand(options);
        const url = await getSignedUrl(client, command, { expiresIn: 300 });

        return {
            statusCode: 200,
            body: JSON.stringify({"url":url})
        };

    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(err)
        }
    }
}