import { Amplify } from "aws-amplify";
// @ts-ignore
import outputs from "../amplify_outputs.json";

// Configure Amplify immediately when this module is imported
Amplify.configure(outputs);

console.log('Amplify configured in amplifyConfig.ts');

export default outputs;