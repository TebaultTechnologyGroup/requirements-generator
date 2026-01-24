
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/**
 * SaaS-ready schema:
 * - Account: stores plan, usage, and limits
 * - Project: stores user inputs + generated PRD outputs
 * 
 * Notes:
 * - All access requires authenticated users (Cognito)
 * - Each model is isolated by owner() rules
 * - This schema supports mocked billing now + Stripe/AWS Marketplace later
 */

const schema = a.schema({

  // -------------------------
  // Account Model (one-per-user)
  // -------------------------
  Account: a
    .model({
      ownerId: a.string().required(),          // Cognito user sub
      plan: a.enum(["FREE", "PRO", "ENTERPRISE"]).default("FREE"),
      monthlyGenerationsUsed: a.integer().default(0),
      monthlyLimit: a.integer().default(5),    // Can be updated on upgrade
      resetAt: a.datetime().required(),        // monthly usage reset time
    })
    .identifier(["ownerId"])                   // One Account per user
    .authorization((allow) => [
      allow.owner(),                           // only owner reads/writes
    ]),

  // -------------------------
  // Project Model
  // -------------------------
  Project: a
    .model({
      ownerId: a.string().required(),         // Cognito user sub
      title: a.string().required(),
      inputsJson: a.json().required(),        // { idea, targetMarket, constraints }
      outputsJson: a.json().required(),       // { prd, stories, risks, mvp }
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
    })
    .authorization((allow) => [
      allow.owner(),                          // full CRUD for owner
    ]),

});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",     // Require authenticated users
  },
});
