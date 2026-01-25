import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from '../amplify/data/resource';


import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  AppBar,
  Toolbar,
  Chip,
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import StepOne from './components/StepOne.tsx';
import StepTwo from './components/StepTwo.tsx';
import StepThree from './components/StepThree.tsx';
import ResultsView from './components/ResultsView.tsx';

const client = generateClient<Schema>();

const steps = ['Product Idea', 'Target & Constraints', 'Review & Generate'];

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

function App() {
  const { user, signOut } = useAuthenticator();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    idea: '',
    targetMarket: '',
    constraints: '',
    additionalContext: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<PRDResult | null>(null);
  const [error, setError] = useState<string>('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [quota, setQuota] = useState({ used: 0, limit: 5 });

  useEffect(() => {
    loadUserProfile();
  }, []);

  async function loadUserProfile() {
    try {
      // Load user profile
      const { data: profiles } = await client.models.UserProfile.list({
        filter: { userId: { eq: user.userId } },
      });

      if (profiles.length === 0) {
        // Create new profile with FREE plan
        const newProfile = await client.models.UserProfile.create({
          userId: user.userId,
          email: user.signInDetails?.loginId || '',
          plan: 'FREE',
          generationsThisMonth: 0,
          monthResetDate: new Date().toISOString(),
        });
        setUserProfile(newProfile.data);
        setQuota({ used: 0, limit: 5 });
      } else {
        const profile = profiles[0];
        setUserProfile(profile);

        // Check if month has reset
        const resetDate = new Date(profile.monthResetDate || '');
        const now = new Date();
        if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
          // Reset counter
          await client.models.UserProfile.update({
            id: profile.id,
            generationsThisMonth: 0,
            monthResetDate: new Date().toISOString(),
          });
          setQuota({ used: 0, limit: getPlanLimit(profile.plan || 'FREE') });
        } else {
          setQuota({
            used: profile.generationsThisMonth || 0,
            limit: getPlanLimit(profile.plan || 'FREE'),
          });
        }
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  }

  function getPlanLimit(plan: string): number {
    switch (plan) {
      case 'FREE': return 5;
      case 'PRO': return 50;
      case 'ENTERPRISE': return 999999;
      default: return 5;
    }
  }

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      idea: '',
      targetMarket: '',
      constraints: '',
      additionalContext: '',
    });
    setResult(null);
    setError('');
  };

  async function handleGenerate() {
    if (quota.used >= quota.limit) {
      setError('You have reached your monthly generation limit. Please upgrade your plan.');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // Call the custom mutation
      const response = await client.mutations.generatePRD({
        idea: formData.idea,
        targetMarket: formData.targetMarket,
        constraints: formData.constraints || undefined,
        additionalContext: formData.additionalContext || undefined,
      });

      if (response.data) {
        const prdData = JSON.parse(response.data as string);

        if (prdData.success) {
          setResult(prdData.data);

          // Update usage count
          if (userProfile) {
            await client.models.UserProfile.update({
              id: userProfile.id,
              generationsThisMonth: (userProfile.generationsThisMonth || 0) + 1,
            });
            setQuota(prev => ({ ...prev, used: prev.used + 1 }));
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
            status: 'COMPLETED',
            createdAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
          });
        } else {
          setError(prdData.error || 'Failed to generate PRD');
        }
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'An error occurred during generation');
    } finally {
      setIsGenerating(false);
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'FREE': return 'default';
      case 'PRO': return 'primary';
      case 'ENTERPRISE': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Product Requirements Generator
          </Typography>

          {userProfile && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mr: 2 }}>
              <Chip
                label={userProfile.plan}
                color={getPlanColor(userProfile.plan)}
                size="small"
              />
              <Typography variant="body2">
                {quota.used}/{quota.limit} generations
              </Typography>
            </Box>
          )}

          <Button
            color="inherit"
            onClick={signOut}
            startIcon={<LogoutIcon />}
          >
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>

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
    </Box>
  );
}

export default App;