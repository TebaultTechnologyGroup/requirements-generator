
// src/pages/UpgradePage.tsx
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { useState } from 'react';

export default function UpgradePage() {
    const [upgraded, setUpgraded] = useState(false);

    // TODO: this should call an API/Mutation to set Account.plan = "PRO"
    function handleUpgradeMock() {
        setUpgraded(true);
    }

    return (
        <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h5">Upgrade</Typography>
                <Typography variant="body1">
                    Free: 5 generations/month • Pro: 50 generations/month • Enterprise: custom limits.
                </Typography>
                {!upgraded ? (
                    <Button variant="contained" onClick={handleUpgradeMock}>Mock Upgrade to Pro</Button>
                ) : (
                    <Alert severity="success">Upgraded! (mock) — plan set to PRO</Alert>
                )}
            </Stack>
        </Paper>
    );
}
