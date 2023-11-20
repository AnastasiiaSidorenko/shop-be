import { APIGatewayAuthorizerResult, PolicyDocument } from "aws-lambda";

export enum Effect {
    Allow = 'Allow',
    Deny = 'Deny'
}

export const AuthorizationService = {
    generatePolicyDocument: (effect: Effect, resource: string): PolicyDocument => {
        return {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource
            }]
        }
    },

    generateResponse: (principalId: string, effect: Effect, resource: string): APIGatewayAuthorizerResult => {
        return {
            principalId,
            policyDocument: AuthorizationService.generatePolicyDocument(effect, resource),
        };
    },

    getDecodedTokenData: (token: string) => {
        const tokenData = Buffer.from(token, "base64").toString("utf-8").split(":");
        return tokenData;
    },
};