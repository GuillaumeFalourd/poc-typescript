import {
    APIGatewayProxyEventV2,
    APIGatewayProxyHandlerV2,
    APIGatewayProxyResultV2
  } from 'aws-lambda'
  import {
    DynamoDBClient
  } from '@aws-sdk/client-dynamodb'
  import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
  
  const ddbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  
  export const apiGatewayEventHandler: APIGatewayProxyHandlerV2<APIGatewayProxyResultV2> =
    async (event: APIGatewayProxyEventV2) => {
      const { accessToken, refreshToken, code } = JSON.parse(event.body!) as any
      const ttl = Math.floor((Date.now() + 5 * 60000) / 1000)
      const tableName = process.env.TABLE_NAME
      const params: PutCommand = new PutCommand({
        TableName: tableName!,
        Item: {
          pk: `code#${code}`,
          sk: "object",
          accessToken: accessToken,
          refreshToken: refreshToken,
          code: code,
          ttl: ttl
        }
      })
    }
  