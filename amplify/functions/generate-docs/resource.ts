import { defineFunction } from '@aws-amplify/backend';

export const generateDocs = defineFunction({
  name: 'generateDocs',
  entry: './handler.ts',
  timeoutSeconds: 120,
  environment: {
    BEDROCK_REGION: 'us-east-2',
  },
});