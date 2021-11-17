import {
    APIGatewayProxyEventV2,
    APIGatewayProxyHandlerV2,
    APIGatewayProxyResultV2
} from 'aws-lambda'
import {
    DynamoDBClient
} from '@aws-sdk/client-dynamodb'
import {
    DynamoDBDocumentClient,
    QueryCommand
} from "@aws-sdk/lib-dynamodb";
import { S3Client, GetObjectCommand} from "@aws-sdk/client-s3";
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const client = new DynamoDBClient({});
const ddbClient = DynamoDBDocumentClient.from(client);

export const apiGatewayEventHandler: APIGatewayProxyHandlerV2<APIGatewayProxyResultV2> = async (event: APIGatewayProxyEventV2) => {
    const tableName = process.env.TABLE_NAME // DynamoDB Table Name
    const params: QueryCommand = new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: {
            ':pk': `repo`
        }
    })

    const client = new S3Client({});

    try {
        const data = await ddbClient.send(params)
        if (data.Count && data.Count > 0 && data.Items) {
            let items = [];
            for (let value of data.Items) {
                const options = {
                    Bucket    : process.env.BUCKET_NAME, // Bucket Name
                    Key    : value['file'],
                };

                const command = new GetObjectCommand(options);
                const url = await getSignedUrl(client, command, { expiresIn: 300 });
                const item = {
                    url: url,
                    name: value['name'],
                    version: value['version']
                }
                items.push(item);
            }
            return {
                statusCode: 200,
                body: JSON.stringify(items)
            }
        }
        return {
            statusCode: 200,
            body: JSON.stringify([])
        }
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(err)
        }
    }
}