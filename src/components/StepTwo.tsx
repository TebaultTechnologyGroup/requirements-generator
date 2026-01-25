import { Box, TextField, Button, Typography } from '@mui/material';
import { ArrowForward, ArrowBack } from '@mui/icons-material';

interface StepTwoProps {
    formData: {
        idea: string;
        targetMarket: string;
        constraints: string;
        additionalContext: string;
    };
    setFormData: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function StepTwo({ formData, setFormData, onNext, onBack }: StepTwoProps) {
    const isValid = formData.targetMarket.trim().length > 5;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h5" gutterBottom>
                Target Market & Constraints
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Define who will use this product and any constraints or requirements that must be considered.
            </Typography>

            <TextField
                label="Target Market"
                multiline
                rows={4}
                value={formData.targetMarket}
                onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                placeholder="Example: Independent freelancers and small agencies (1-5 people) in creative fields like design, writing, and consulting. Primary users are 25-45 years old, tech-savvy, and working remotely."
                helperText="Who are your primary users? What are their characteristics?"
                fullWidth
                required
            />

            <TextField
                label="Constraints (Optional)"
                multiline
                rows={4}
                value={formData.constraints}
                onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                placeholder="Example: Must work on iOS and Android. Budget is limited to $50k for MVP. Must launch within 4 months. Should integrate with QuickBooks and Stripe."
                helperText="Budget, timeline, technical, or regulatory constraints"
                fullWidth
            />

            <TextField
                label="Additional Context (Optional)"
                multiline
                rows={4}
                value={formData.additionalContext}
                onChange={(e) => setFormData({ ...formData, additionalContext: e.target.value })}
                placeholder="Example: We already have a web version with 1,000 users. Competitor analysis shows that FreshBooks and Harvest dominate the market, but users find them too complex."
                helperText="Market research, competitor info, or other relevant details"
                fullWidth
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                    variant="outlined"
                    onClick={onBack}
                    startIcon={<ArrowBack />}
                >
                    Back
                </Button>

                <Button
                    variant="contained"
                    onClick={onNext}
                    disabled={!isValid}
                    endIcon={<ArrowForward />}
                >
                    Next
                </Button>
            </Box>
        </Box>
    );
}