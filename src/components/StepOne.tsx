import { Box, TextField, Button, Typography } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

interface StepOneProps {
    formData: {
        idea: string;
        targetMarket: string;
        constraints: string;
        additionalContext: string;
    };
    setFormData: (data: any) => void;
    onNext: () => void;
}

export default function StepOne({ formData, setFormData, onNext }: StepOneProps) {
    const isValid = formData.idea.trim().length > 10;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h5" gutterBottom>
                Describe Your Product Idea
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Provide a clear description of your product concept. The more detail you provide,
                the better the generated requirements will be.
            </Typography>

            <TextField
                label="Product Idea"
                multiline
                rows={8}
                value={formData.idea}
                onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
                placeholder="Example: A mobile app that helps freelancers track their time, generate invoices, and manage client relationships. The app should be simple to use, work offline, and integrate with popular accounting software."
                helperText={`${formData.idea.length} characters (minimum 10)`}
                fullWidth
                required
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
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