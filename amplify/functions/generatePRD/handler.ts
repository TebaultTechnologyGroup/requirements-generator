import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-2',
});

export const handler = async (event: any) => {
  try {
    // AppSync passes arguments directly as the event object
    const { idea, targetMarket, constraints, additionalContext } = event.arguments;

    if (!idea || !targetMarket) {
      throw new Error('Missing required arguments: idea or targetMarket');
    }

    const prompt = buildPrompt({ idea, targetMarket, constraints, additionalContext });

    const modelId = 'us.anthropic.claude-3-haiku-20240307-v1:0';
    
    const payload = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    };

    const command = new InvokeModelCommand({
      modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const generatedText = responseBody.content[0].text;
    
    // Validate JSON structure before returning
    const prdOutput = parseAndValidateJSON(generatedText);

    // Return the stringified result directly for the GraphQL 'returns(a.string())'
    return JSON.stringify({
      success: true,
      data: prdOutput,
    });

  } catch (error: any) {
    console.error('Error generating PRD:', error);
    // Returning a stringified error so the frontend can parse it
    return JSON.stringify({
      success: false,
      error: error.message || 'Failed to generate PRD',
    });
  }
};


function buildPrompt({ 
  idea, 
  targetMarket, 
  constraints, 
  additionalContext 
}: { 
  idea: string; 
  targetMarket: string; 
  constraints?: string; 
  additionalContext?: string; 
}): string {
  return `You are a senior product manager creating a comprehensive Product Requirements Document (PRD).

Generate a structured PRD based on the following information:

PRODUCT IDEA:
${idea}

TARGET MARKET:
${targetMarket}

${constraints ? `CONSTRAINTS:\n${constraints}\n` : ''}
${additionalContext ? `ADDITIONAL CONTEXT:\n${additionalContext}\n` : ''}

CRITICAL: You must respond with ONLY valid JSON matching this exact schema. Do not include any markdown formatting, backticks, or introductory/explanatory text.

{
  "productRequirements": {
    "overview": "Clear 2-3 sentence product overview",
    "goals": ["Goal 1", "Goal 2", "Goal 3"],
    "successMetrics": ["Metric 1", "Metric 2", "Metric 3"]
  },
  "userStories": [
    {
      "role": "User role",
      "action": "What they want to do",
      "benefit": "Why they want to do it",
      "acceptanceCriteria": ["Criterion 1", "Criterion 2"]
    }
  ],
  "risks": [
    {
      "category": "Technical|Market|Operational|Financial",
      "description": "Risk description",
      "likelihood": "Low|Medium|High",
      "impact": "Low|Medium|High",
      "mitigation": "How to address this risk"
    }
  ],
  "mvpScope": {
    "inScope": ["Feature 1", "Feature 2"],
    "outOfScope": ["Feature to defer", "Another to defer"],
    "timeline": "Estimated timeline for MVP",
    "assumptions": ["Assumption 1", "Assumption 2"]
  }
}`;
}

function parseAndValidateJSON(text: string): any {
  // Claude sometimes adds conversational filler or markdown blocks. 
  // This regex extracts the first valid JSON object found in the string.
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const cleanedText = jsonMatch ? jsonMatch[0] : text;

  try {
    const parsed = JSON.parse(cleanedText);
    
    // Validate required top-level keys
    const requiredKeys = ['productRequirements', 'userStories', 'risks', 'mvpScope'];
    for (const key of requiredKeys) {
      if (!parsed[key]) {
        throw new Error(`Missing required field: ${key}`);
      }
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to parse JSON content:', cleanedText);
    throw new Error('The AI model generated an invalid response format. Please try again.');
  }
}