import {
    APIGatewayProxyEventV2,
    APIGatewayProxyHandlerV2,
    APIGatewayProxyResultV2
} from 'aws-lambda'
import {
    DynamoDBClient
} from '@aws-sdk/client-dynamodb'
import { S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import {getSecretsByKey} from "../services/secretManager";
import * as download from "download";
import * as fs from "fs";

export const apiGatewayEventHandler: APIGatewayProxyHandlerV2<APIGatewayProxyResultV2> = async (event: APIGatewayProxyEventV2) => {
    const { zipURL, name, version } = JSON.parse(event.body!) as any

    // Download ZIP object from Git repository
    const filename = `${name}-${version}.zip`;
    const githubToken = await getSecretsByKey('GITHUB_TOKEN');
    console.info('Trying to download file', filename ,'from url', zipURL);
    try {
        await download(zipURL, "/tmp", {
            filename: filename,
            headers: {
                authorization: 'Bearer ' + githubToken
            }
        })

    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify("ERROR DOWNLOAD GIT: " + err)
        }
    }

    // Upload ZIP object on AWS S3
    const s3 = new S3Client({});
    const file = fs.createReadStream("/tmp/" + filename);
    try {
        var options = {
            Bucket : process.env.BUCKET_NAME,
            Key : filename,
            Body : file
        }
        console.info('Trying to upload file', filename ,'to bucket', options.Bucket);
        await s3.send(new PutObjectCommand(options));
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify("ERROR UPLOAD S3: " + err)
        }
    }

    // Save repo datas on DynamoDB
    const tableName = process.env.TABLE_NAME;
    const params: PutCommand = new PutCommand({
        TableName: tableName!,
        Item: {
            pk: `repo`,
            sk: `repo#${name}`,
            name: name,
            version: version,
            file: filename
        }
    })

    try {
        const client = new DynamoDBClient({});
        const ddbClient = DynamoDBDocumentClient.from(client);
        const data = await ddbClient.send(params)
        console.info('Trying to save datas', filename ,'on DynamoDB');
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        }
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify("ERROR DYNAMO DB: " + err)
        }
    }
}