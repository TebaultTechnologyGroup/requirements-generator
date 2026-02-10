import { useState } from "react";
import { generateClient } from "aws-amplify/data";
import { Auth } from "aws-amplify";
import type { Schema } from "../../amplify/data/resource";
import { Container, Stepper, Step, StepLabel, Paper } from "@mui/material";
import StepOne from "../components/StepOne";
import StepTwo from "../components/StepTwo";
import StepThree from "../components/StepThree";
import ResultsView from "../components/ResultsView";

const client = generateClient<Schema>();

const steps = ["Product Idea", "Target & Constraints", "Review & Generate"];

interface FormData {
  idea: string;
  targetMarket: string;
  constraints: string;
  additionalContext: string;
}

interface PRDResult {
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

export default function NewProjectPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    idea: "",
    targetMarket: "",
    constraints: "",
    additionalContext: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<PRDResult | null>(null);
  const [error, setError] = useState<string>("");
  const [userProfile] = useState<any>(null);
  const [quota, setQuota] = useState({ used: 0, limit: 5 });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      idea: "",
      targetMarket: "",
      constraints: "",
      additionalContext: "",
    });
    setResult(null);
    setError("");
  };

  async function handleGenerate() {
    const user = await Auth.currentAuthenticatedUser();

    if (quota.used >= quota.limit) {
      setError(
        "You have reached your monthly generation limit. Please upgrade your plan.",
      );
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      console.log("Starting generation with data:", {
        idea: formData.idea.substring(0, 50) + "...",
        targetMarket: formData.targetMarket.substring(0, 50) + "...",
        constraints: formData.constraints.substring(0, 50) + "...",
        additionalContext: formData.additionalContext.substring(0, 50) + "...",
      });

      // Call the custom mutation
      const response = await client.mutations.generatePRD({
        idea: formData.idea,
        targetMarket: formData.targetMarket,
        constraints: formData.constraints || undefined,
        additionalContext: formData.additionalContext || undefined,
      });

      console.log("Raw response:", response);

      if (response.data) {
        console.log("Response data:", response.data);
        const prdData = JSON.parse(response.data as string);
        console.log("Parsed PRD data:", prdData);

        if (prdData.success) {
          setResult(prdData.data);

          // Update usage count
          if (userProfile) {
            await client.models.UserProfile.update({
              id: userProfile.id,
              generationsThisMonth: (userProfile.generationsThisMonth || 0) + 1,
            });
            setQuota((prev) => ({ ...prev, used: prev.used + 1 }));
          }

          // Save generation to history
          await client.models.Generation.create({
            userId: user.userId,
            idea: formData.idea,
            targetMarket: formData.targetMarket,
            constraints: formData.constraints,
            additionalContext: formData.additionalContext,
            productRequirements: prdData.data.productRequirements,
            userStories: prdData.data.userStories,
            risks: prdData.data.risks,
            mvpScope: prdData.data.mvpScope,
            status: "COMPLETED",
            createdAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
          });
        } else {
          console.error("PRD generation failed:", prdData.error);
          setError(prdData.error || "Failed to generate PRD");
        }
      } else if (response.errors) {
        console.error("GraphQL errors:", response.errors);
        setError(
          `GraphQL Error: ${response.errors.map((e: any) => e.message).join(", ")}`,
        );
      } else {
        console.error("No data in response");
        setError("No data returned from generation");
      }
    } catch (err: any) {
      console.error("Generation error:", err);
      console.error("Error details:", {
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
      setError(err.message || "An error occurred during generation");
    } finally {
      setIsGenerating(false);
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "FREE":
        return "default";
      case "PRO":
        return "primary";
      case "ENTERPRISE":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        {!result ? (
          <>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {activeStep === 0 && (
              <StepOne
                formData={formData}
                setFormData={setFormData}
                onNext={handleNext}
              />
            )}

            {activeStep === 1 && (
              <StepTwo
                formData={formData}
                setFormData={setFormData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {activeStep === 2 && (
              <StepThree
                formData={formData}
                onBack={handleBack}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                error={error}
              />
            )}
          </>
        ) : (
          <ResultsView
            result={result}
            formData={formData}
            onReset={handleReset}
          />
        )}
      </Paper>
    </Container>
  );
}
