import { Box, Button, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { ArrowBack, AutoAwesome } from '@mui/icons-material';

interface StepThreeProps {
    formData: {
        idea: string;
        targetMarket: string;
        constraints: string;
        additionalContext: string;
    };
    onBack: () => void;
    onGenerate: () => void;
    isGenerating: boolean;
    error: string;
}

export default function StepThree({ formData, onBack, onGenerate, isGenerating, error }: StepThreeProps) {
    const handleGenerateClick = () => {
        console.log('Generate button clicked in StepThree');
        onGenerate();
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h5" gutterBottom>
                Review & Generate
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Review your inputs before generating the Product Requirements Document.
            </Typography>

            <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                    Product Idea
                </Typography>
                <Typography variant="body2" paragraph>
                    {formData.idea}
                </Typography>

                <Typography variant="subtitle2" color="primary" gutterBottom>
                    Target Market
                </Typography>
                <Typography variant="body2" paragraph>
                    {formData.targetMarket}
                </Typography>

                {formData.constraints && (
                    <>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                            Constraints
                        </Typography>
                        <Typography variant="body2" paragraph>
                            {formData.constraints}
                        </Typography>
                    </>
                )}

                {formData.additionalContext && (
                    <>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                            Additional Context
                        </Typography>
                        <Typography variant="body2" paragraph>
                            {formData.additionalContext}
                        </Typography>
                    </>
                )}
            </Paper>

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                    <strong>How it works:</strong> Our AI will analyze your input and generate a comprehensive
                    Product Requirements Document including product overview, user stories, risk analysis, and MVP scope.
                    All outputs are validated against a structured schema to ensure quality and consistency.
                </Typography>
            </Alert>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                    variant="outlined"
                    onClick={onBack}
                    disabled={isGenerating}
                    startIcon={<ArrowBack />}
                >
                    Back
                </Button>

                <Button
                    variant="contained"
                    size="large"
                    onClick={handleGenerateClick}
                    disabled={isGenerating}
                    startIcon={isGenerating ? <CircularProgress size={20} /> : <AutoAwesome />}
                >
                    {isGenerating ? 'Generating PRD...' : 'Generate PRD'}
                </Button>
            </Box>
        </Box>
    );
}