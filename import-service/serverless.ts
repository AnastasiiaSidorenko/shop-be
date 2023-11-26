import { importFileParser, importProductsFile } from '@functions/index';
import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      BUCKET_NAME: "my-aws-course-import-products",
      UPLOADED_FILES_FOLDER: "uploaded",
      PARSED_FILES_FOLDER: "parsed",
      QUEUE_URL: {
        "Fn::ImportValue": "queueURL",
      },
      QUEUE_ARN: {
        "Fn::ImportValue": "queueARN",
      },
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "s3:ListBucket",
        Resource:
          "arn:aws:s3:::my-aws-course-import-products",
      },
      {
        Effect: "Allow",
        Action: "s3:*",
        Resource:
          "arn:aws:s3:::my-aws-course-import-products/*",
      },
      {
        Effect: "Allow",
        Action: ["sqs:*"],
        Resource: "${self:provider.environment.QUEUE_ARN}",
      },
    ],
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      GatewayResponseUnauthorized: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Headers": "'*'",
            "gatewayresponse.header.WWW-Authenticate": "'Basic'",
          },
          RestApiId: {
            Ref: "ApiGatewayRestApi",
          },
          ResponseType: "UNAUTHORIZED",
          StatusCode: "401",
        },
      },
      GatewayResponseForbidden: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Headers": "'*'",
          },
          RestApiId: {
            Ref: "ApiGatewayRestApi",
          },
          ResponseType: "ACCESS_DENIED",
          StatusCode: "403",
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
