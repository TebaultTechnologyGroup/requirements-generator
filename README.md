# AI Product Requirements Generator

> A SaaS-ready GenAI product built with AWS Amplify, demonstrating authenticated users, usage tracking, LLM prompt orchestration, and plan-based quota enforcement.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![AWS](https://img.shields.io/badge/AWS-Amplify-orange.svg)
![React](https://img.shields.io/badge/React-18.3-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)

## 🎯 Overview

This application demonstrates how GenAI features can be safely and cost-effectively offered as a scalable service. Users input their product idea, target market, and constraints, and the AI generates comprehensive product requirements documents including user stories, risk analysis, and MVP scope recommendations.

**Built for portfolio demonstration** - showcasing integration of modern GenAI capabilities into a production-ready SaaS architecture.

## ✨ Key Features

### Core Functionality

- **Guided Multi-Step Form** - Material-UI Stepper interface for intuitive data collection
- **AI-Powered Generation** - Structured JSON outputs from AWS Bedrock (Claude 3 Haiku)
- **Comprehensive PRD Output**:
  - Product overview with goals and success metrics
  - User stories with acceptance criteria
  - Risk analysis with mitigation strategies
  - MVP scope with in/out-of-scope features
- **Editable Results** - Interactive tabbed view of generated content
- **Export Capabilities** - Download as Markdown for documentation

### SaaS Features

- **Authentication** - Email-based auth with AWS Cognito
- **Usage Tracking** - Per-user generation counts with monthly reset
- **Plan-Based Quotas**:
  - **Free**: 5 generations/month
  - **Pro**: 50 generations/month
  - **Enterprise**: Unlimited generations
- **Generation History** - All PRDs saved to user's account

## 🧠 GenAI Integration Highlights

This project showcases several advanced prompt engineering and LLM integration techniques:

### 1. **Structured Schema Enforcement**

All LLM responses are constrained to a predefined JSON schema, ensuring consistency and reliability:

```typescript
interface PRDOutput {
  productRequirements: {
    overview: string;
    goals: string[];
    successMetrics: string[];
  };
  userStories: Array<{...}>;
  risks: Array<{...}>;
  mvpScope: {...};
}
```

### 2. **Prompt Template Design**

Dynamic prompt construction based on user input with clear instructions:

- Explicit output format requirements
- Schema examples embedded in prompt
- Context injection from user forms

### 3. **Validation & Retry Logic**

- JSON parsing with error handling
- Markdown fence stripping
- Schema validation before rendering
- Graceful failure states with user feedback

### 4. **Hallucination Prevention**

- Constrained output formats
- Explicit enumeration of allowed values (e.g., risk levels: Low/Medium/High)
- Structured data over free-form text

### 5. **Cost Optimization**

- Using Claude 3 Haiku (~$0.004 per generation)
- Efficient token usage through concise prompts
- Estimated monthly cost: <$10 for hundreds of generations

## 🏗️ Architecture

```
┌─────────────────┐
│   React + MUI   │  ← User Interface
└────────┬────────┘
         │
┌────────▼────────┐
│ AWS Amplify Gen2│  ← Backend Framework
├─────────────────┤
│  • Auth (Cognito)
│  • Data (AppSync + DynamoDB)
│  • Functions (Lambda)
└────────┬────────┘
         │
┌────────▼────────┐
│  AWS Bedrock    │  ← LLM Integration
│ Claude 3 Haiku  │
└─────────────────┘
```

### Tech Stack

**Frontend:**

- React 18.3 with TypeScript
- Material-UI 6.3 (Stepper, Tables, Tabs)
- AWS Amplify UI React (Authentication)
- Vite (Build tool)

**Backend:**

- AWS Amplify Gen2
- AWS Lambda (Bedrock integration)
- Amazon DynamoDB (Data storage)
- AWS Cognito (User auth)
- AWS AppSync (GraphQL API)

**AI/ML:**

- AWS Bedrock
- Anthropic Claude 3 Haiku

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.20.0
- npm >= 10.8.0
- AWS Account with:
  - Amplify access
  - Bedrock model access (Claude 3 Haiku)
  - Appropriate IAM permissions

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/ai-prd-generator.git
cd ai-prd-generator
```

2. **Install dependencies**

```bash
npm install
```

3. **Enable Bedrock Model Access**
   - Go to AWS Console → Bedrock → Model Access
   - Request access to "Anthropic Claude 3 Haiku"
   - Wait for approval (usually instant)

4. **Configure Amplify**

```bash
npx ampx sandbox
```

5. **Start development server**

```bash
npm run dev
```

### Deployment

```bash
# Deploy to AWS Amplify
git push origin main

# Amplify will automatically:
# - Deploy backend resources
# - Build and host frontend
# - Configure CI/CD pipeline
```

## 📊 Cost Analysis

**Per Generation Estimate:**

- Input: ~2,000 tokens ($0.0005)
- Output: ~3,000 tokens ($0.00375)
- **Total: ~$0.00425/generation**

**Monthly Cost Examples:**

- Free tier (5 gens): $0.02/month
- Pro tier (50 gens): $0.21/month
- Enterprise (500 gens): $2.13/month

**Even with 1,000 generations/month: < $5**

## 🎓 Learning Outcomes

This project demonstrates proficiency in:

1. **Full-Stack Development**
   - Modern React patterns (hooks, context)
   - TypeScript for type safety
   - Material-UI component library

2. **AWS Cloud Services**
   - Amplify Gen2 framework
   - Lambda serverless functions
   - Bedrock LLM integration
   - DynamoDB NoSQL database
   - Cognito authentication

3. **GenAI Integration**
   - Prompt engineering
   - Structured output generation
   - Error handling and validation
   - Cost optimization

4. **SaaS Fundamentals**
   - User authentication
   - Usage tracking and quotas
   - Plan-based feature gating
   - Data persistence

## 🔒 Security Considerations

- **API Keys**: Never exposed to frontend; Lambda handles Bedrock calls
- **Authentication**: Required for all operations
- **Authorization**: Users can only access their own data
- **Input Validation**: All user inputs sanitized
- **Rate Limiting**: Quota enforcement prevents abuse

## 📝 Future Enhancements

- [ ] PDF/Document upload for additional context
- [ ] Export to Jira/Linear integration
- [ ] AI-powered editing suggestions
- [ ] Version history with diff view
- [ ] Collaborative PRD editing
- [ ] Template library for different product types
- [ ] Stripe integration for real billing

## 📄 License

MIT License - see LICENSE file for details

## 👤 Author

**Your Name**

- Portfolio: [yourwebsite.com](https://yourwebsite.com)
- LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- AWS Amplify team for the Gen2 framework
- Anthropic for Claude API access
- Material-UI for component library

---

**Note:** This is a demonstration project built for portfolio purposes. The SaaS billing component is mocked and does not process real payments.
