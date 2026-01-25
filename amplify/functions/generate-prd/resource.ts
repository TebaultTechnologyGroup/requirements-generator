import { defineFunction } from '@aws-amplify/backend';

export const generatePRD = defineFunction({
  name: 'generatePRD',
  entry: './handler.ts',
  timeoutSeconds: 120,
  environment: {
    BEDROCK_REGION: 'us-east-2',
  },
});