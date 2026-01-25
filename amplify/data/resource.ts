import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // Custom mutation to generate PRD via Lambda
  generatePRD: a
    .mutation()
    .arguments({
      idea: a.string().required(),
      targetMarket: a.string().required(),
      constraints: a.string(),
      additionalContext: a.string(),
    })
    .returns(a.json())
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function('generate-prd')),
    
  UserProfile: a
    .model({
      userId: a.string().required(),
      email: a.string().required(),
      plan: a.enum(['FREE', 'PRO', 'ENTERPRISE']),
      generationsThisMonth: a.integer().default(0),
      monthResetDate: a.string(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read'])
    ]),

  Generation: a
    .model({
      userId: a.string().required(),
      idea: a.string().required(),
      targetMarket: a.string().required(),
      constraints: a.string(),
      additionalContext: a.string(),
      
      // Output fields
      productRequirements: a.json(),
      userStories: a.json(),
      risks: a.json(),
      mvpScope: a.json(),
      
      // Metadata
      status: a.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']),
      createdAt: a.datetime(),
      completedAt: a.datetime(),
      errorMessage: a.string(),
    })
    .authorization((allow) => [
      allow.owner(),
    ]),

  PlanQuota: a
    .model({
      plan: a.enum(['FREE', 'PRO', 'ENTERPRISE']),
      monthlyLimit: a.integer().required(),
      description: a.string(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read']),
      allow.guest().to(['read'])
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});