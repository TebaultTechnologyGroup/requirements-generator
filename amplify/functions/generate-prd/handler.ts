import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.BEDROCK_REGION || 'us-east-2',
});

interface PRDInput {
  idea: string;
  targetMarket: string;
  constraints?: string;
  additionalContext?: string;
}

interface PRDOutput {
  productRequirements: {
    overview: string;
    goals: string[];
    successMetrics: string[];
  };
  userStories: Array<{
    role: string;
    action: string;
    benefit: string;
    acceptanceCriteria: string[];
  }>;
  risks: Array<{
    category: string;
    description: string;
    likelihood: string;
    impact: string;
    mitigation: string;
  }>;
  mvpScope: {
    inScope: string[];
    outOfScope: string[];
    timeline: string;
    assumptions: string[];
  };
}

export const handler = async (event: any) => {
  try {
    const input: PRDInput = JSON.parse(event.body);

    // Construct the prompt with schema enforcement
    const prompt = buildPrompt(input);

    // Call Bedrock with Claude Haiku
    const modelId = 'anthropic.claude-3-haiku-20240307-v1:0';
    
    const payload = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
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
    
    // Extract the text content from Claude's response
    const generatedText = responseBody.content[0].text;
    
    // Parse the JSON response with retry logic
    const prdOutput = parseAndValidateJSON(generatedText);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        data: prdOutput,
      }),
    };
  } catch (error: any) {
    console.error('Error generating PRD:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: error.message || 'Failed to generate PRD',
      }),
    };
  }
};

function buildPrompt(input: PRDInput): string {
  return `You are a senior product manager creating a comprehensive Product Requirements Document (PRD).

Generate a structured PRD based on the following information:

PRODUCT IDEA:
${input.idea}

TARGET MARKET:
${input.targetMarket}

${input.constraints ? `CONSTRAINTS:\n${input.constraints}\n` : ''}
${input.additionalContext ? `ADDITIONAL CONTEXT:\n${input.additionalContext}\n` : ''}

CRITICAL: You must respond with ONLY valid JSON matching this exact schema. Do not include any markdown formatting, backticks, or explanatory text.

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
}

Generate 5-8 user stories, 4-6 risks, and be specific about MVP scope.`;
}

function parseAndValidateJSON(text: string): PRDOutput {
  // Remove any potential markdown formatting
  let cleanedText = text.trim();
  
  // Remove markdown code blocks if present
  cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  
  try {
    const parsed = JSON.parse(cleanedText);
    
    // Basic validation
    if (!parsed.productRequirements || !parsed.userStories || !parsed.risks || !parsed.mvpScope) {
      throw new Error('Missing required fields in response');
    }
    
    return parsed as PRDOutput;
  } catch (error) {
    console.error('Failed to parse JSON:', cleanedText);
    throw new Error('LLM returned invalid JSON format');
  }
}