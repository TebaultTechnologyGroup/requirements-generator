# Prompt Engineering Guide

This guide explains the prompt engineering techniques used in this application and how to customize them.

## Current Prompt Structure

Location: `amplify/functions/generatePRD/handler.ts` → `buildPrompt()` function

### Key Techniques Used

#### 1. **Role Definition**

```typescript
"You are a senior product manager creating a comprehensive Product Requirements Document (PRD).";
```

- Sets context and expertise level
- Influences output quality and tone

#### 2. **Structured Input**

```typescript
PRODUCT IDEA:
${input.idea}

TARGET MARKET:
${input.targetMarket}
```

- Clear section headers
- Organized information flow
- Easy for LLM to parse

#### 3. **Schema Enforcement**

```typescript
CRITICAL: You must respond with ONLY valid JSON matching this exact schema.
Do not include any markdown formatting, backticks, or explanatory text.
```

- Prevents unwanted formatting
- Ensures parseable output
- Reduces post-processing

#### 4. **Example Schema**

```json
{
  "productRequirements": {
    "overview": "Clear 2-3 sentence product overview",
    "goals": ["Goal 1", "Goal 2", "Goal 3"]
  }
}
```

- Shows exact format expected
- Demonstrates data types
- Guides field population

#### 5. **Explicit Constraints**

```typescript
"Generate 5-8 user stories, 4-6 risks, and be specific about MVP scope.";
```

- Prevents too-short or too-long outputs
- Ensures comprehensive coverage
- Maintains consistency

## Customization Examples

### Adjusting Creativity/Determinism

In `handler.ts`, modify the temperature:

```typescript
const payload = {
  temperature: 0.7, // Current: Balanced
  // temperature: 0.3,  // More conservative/consistent
  // temperature: 0.9,  // More creative/varied
};
```

**Recommended by use case:**

- 0.3-0.5: Enterprise/regulated industries (consistent, safe)
- 0.6-0.8: Startups/innovation (balanced)
- 0.8-1.0: Creative products (novel ideas)

### Adding New Output Sections

**1. Update the TypeScript interface:**

```typescript
interface PRDOutput {
  // ... existing fields
  competitorAnalysis: {
    competitors: string[];
    differentiators: string[];
  };
}
```

**2. Update the schema in the prompt:**

```json
{
  "competitorAnalysis": {
    "competitors": ["Competitor 1", "Competitor 2"],
    "differentiators": ["Key difference 1", "Key difference 2"]
  }
}
```

**3. Update the frontend types and components to display it**

### Industry-Specific Variants

Create different prompt templates for different industries:

```typescript
function buildPrompt(input: PRDInput, industry?: string): string {
  const roleMap = {
    healthcare:
      "You are a healthcare product manager familiar with HIPAA compliance...",
    fintech:
      "You are a fintech product manager familiar with regulatory requirements...",
    default: "You are a senior product manager...",
  };

  const role = roleMap[industry || "default"];
  // ... rest of prompt
}
```

### Enhancing User Stories

Make user stories more detailed:

```typescript
"userStories": [
  {
    "role": "User role (be specific, e.g., 'First-time freelancer')",
    "action": "What they want to do (be action-oriented)",
    "benefit": "Why they want to do it (focus on value)",
    "acceptanceCriteria": [
      "GIVEN [context] WHEN [action] THEN [result]",
      "Another criterion in Given-When-Then format"
    ],
    "priority": "High|Medium|Low",
    "estimatedEffort": "Small|Medium|Large"
  }
]
```

### Adding Hallucination Guards

Strengthen constraints for critical fields:

```typescript
const prompt = `
...
CRITICAL REQUIREMENTS:
1. All risks must have CONCRETE mitigation strategies (not generic advice)
2. Timeline must be REALISTIC (no "2-4 weeks" for complex features)
3. Success metrics must be MEASURABLE (include specific numbers/percentages)
4. Do NOT invent company names, competitor names, or specific technologies not mentioned in the input

VALIDATION:
- Each user story must have at least 2 acceptance criteria
- Each risk must specify both likelihood AND impact
- MVP scope must include at least 3 in-scope and 2 out-of-scope items
...
`;
```

## Advanced Techniques

### Chain-of-Thought Prompting

For more thorough analysis:

```typescript
const prompt = `
First, analyze the product idea and identify:
1. Core user pain points
2. Key assumptions
3. Critical success factors

Then, based on this analysis, generate the PRD following the schema below.

[Include your analysis in a "reasoning" field, then the PRD]
`;
```

### Few-Shot Examples

Provide examples for better outputs:

```typescript
const prompt = `
Here's an example of a GOOD user story:
{
  "role": "Small business owner with no accounting experience",
  "action": "automatically categorize expenses from bank transactions",
  "benefit": "save 5+ hours per week on bookkeeping",
  "acceptanceCriteria": [
    "System correctly categorizes 80%+ of transactions",
    "User can easily correct miscategorizations in 1 click"
  ]
}

Here's an example of a BAD user story:
{
  "role": "User",
  "action": "use the app",
  "benefit": "it's helpful"
}

Now generate user stories for this product...
`;
```

### Iterative Refinement

Add a second API call for refinement:

```typescript
// First call: Generate initial PRD
const initialPRD = await callBedrock(prompt1);

// Second call: Refine specific sections
const refinedRisks = await callBedrock(`
Review these risks and ensure each has:
- Specific likelihood percentage
- Quantified impact assessment
- Actionable mitigation plan

Risks: ${JSON.stringify(initialPRD.risks)}

Return improved version as JSON.
`);
```

## Testing Your Prompts

### A/B Testing Different Prompts

```typescript
const prompts = {
  v1: buildPromptV1(input),
  v2: buildPromptV2(input),
};

// Log which version was used
console.log("Using prompt version:", config.promptVersion);
const result = await callBedrock(prompts[config.promptVersion]);
```

### Evaluation Criteria

Test your prompts with these criteria:

1. **Completeness**: Are all required fields populated?
2. **Relevance**: Do outputs match the input?
3. **Specificity**: Are examples concrete vs. generic?
4. **Consistency**: Similar inputs → similar quality outputs?
5. **Parsability**: Does JSON parse 100% of the time?

### Sample Test Cases

```typescript
const testCases = [
  {
    name: "Simple mobile app",
    idea: "A todo app with cloud sync",
    targetMarket: "Busy professionals",
    expectedUserStories: 5 - 8,
    expectedRisks: 4 - 6,
  },
  {
    name: "Complex B2B SaaS",
    idea: "Enterprise resource planning system",
    targetMarket: "Large manufacturing companies",
    expectedUserStories: 8 - 12,
    expectedRisks: 6 - 10,
  },
];
```

## Cost vs. Quality Tradeoffs

### Using Different Models

```typescript
// Haiku: Fast, cheap, good for structured output
const modelId = "anthropic.claude-3-haiku-20240307-v1:0";
// Cost: ~$0.004/generation

// Sonnet: Balanced, better reasoning
const modelId = "anthropic.claude-3-sonnet-20240229-v1:0";
// Cost: ~$0.015/generation

// Opus: Highest quality, slowest
const modelId = "anthropic.claude-3-opus-20240229-v1:0";
// Cost: ~$0.075/generation
```

### Token Optimization

Reduce costs by optimizing prompts:

```typescript
// Verbose (expensive):
"Please generate a comprehensive and detailed product requirements document...";

// Concise (cheaper):
"Generate a PRD with:";
```

For this application, Haiku provides excellent quality at minimal cost. Only upgrade to Sonnet/Opus if you need:

- More creative/nuanced outputs
- Deeper analysis
- Complex reasoning tasks

## Monitoring & Logging

Add prompt tracking:

```typescript
export const handler = async (event: any) => {
  const startTime = Date.now();

  try {
    const prompt = buildPrompt(input);

    // Log prompt length for monitoring
    console.log("Prompt tokens (estimated):", prompt.length / 4);

    const response = await bedrockClient.send(command);

    // Log response metrics
    console.log("Generation time:", Date.now() - startTime);
    console.log("Response tokens:", responseBody.usage.output_tokens);

    return result;
  } catch (error) {
    // Log failures for prompt improvement
    console.error("Prompt that failed:", prompt);
  }
};
```

## Best Practices

1. **Always validate outputs** - Don't trust LLM blindly
2. **Provide fallbacks** - Have default values for optional fields
3. **Clear > Clever** - Simple prompts often work better
4. **Test edge cases** - Very short inputs, very long inputs, special characters
5. **Version your prompts** - Track changes and their impact
6. **Monitor costs** - Set CloudWatch alarms for unexpected usage

## Resources

- [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/claude/docs/prompt-engineering)
- [AWS Bedrock Best Practices](https://docs.aws.amazon.com/bedrock/latest/userguide/best-practices.html)
- [Prompt Engineering Papers](https://github.com/dair-ai/Prompt-Engineering-Guide)
