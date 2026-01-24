
// src/pages/AuthPage.tsx
import { Authenticator } from '@aws-amplify/ui-react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function AuthPage() {
    return (
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
            <Paper sx={{ p: 4, width: 420, maxWidth: '90%' }}>
                <Typography variant="h6" mb={2}>Sign in</Typography>
                <Authenticator />
            </Paper>
        </Box>
    );
}
