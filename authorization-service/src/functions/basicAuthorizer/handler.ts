import { APIGatewayRequestAuthorizerEvent, APIGatewayAuthorizerResult } from 'aws-lambda';
import { AuthorizationService, Effect } from 'src/service/AuthorizationService';

export const basicAuthorizer = async (event: APIGatewayRequestAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
  console.log('Event', event);

  const { headers, methodArn } = event;

  if (!headers.Authorization) {
    throw new Error("Unauthorized");
  }

  try {
    const token = headers.Authorization.split(" ")[1];
    
    const [login, password] = AuthorizationService.getDecodedTokenData(token);

    const storedUserPassword = process.env[login];

    const responseEffect = storedUserPassword &&
      storedUserPassword === password ? Effect.Allow : Effect.Deny;

    const response = AuthorizationService.generateResponse(token, responseEffect, methodArn);
    console.log('Response', response);
    return response;
  } catch (error) {
    console.log(error);
  }
};
