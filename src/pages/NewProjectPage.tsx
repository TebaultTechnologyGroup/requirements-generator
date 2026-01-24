
// src/pages/NewProjectPage.tsx
import { useState } from 'react';
import { z } from 'zod';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import { useNavigate } from '@tanstack/react-router';

// Simple schema for input validation
const IdeaSchema = z.object({
    title: z.string().min(3),
    idea: z.string().min(10),
    targetMarket: z.string().min(3),
    constraints: z.string().optional(),
});

export default function NewProjectPage() {
    const nav = useNavigate();
    const [form, setForm] = useState({ title: '', idea: '', targetMarket: '', constraints: '' });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleGenerate() {
        setError(null);
        const parsed = IdeaSchema.safeParse(form);
        if (!parsed.success) {
            setError('Please complete all required fields (title, idea, target market).');
            return;
        }
        try {
            setLoading(true);
            // TODO:
            // 1) Check entitlements (usage/quota)
            // 2) Save a Project draft
            // 3) Call Lambda -> Bedrock to generate PRD
            // 4) Save outputs, redirect to /project/:id
            await new Promise((r) => setTimeout(r, 800)); // mock
            const fakeId = crypto.randomUUID();
            nav({ to: `/project/${fakeId}` });
        } catch (e: any) {
            setError(e?.message ?? 'Failed to generate.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h5">New Product Brief</Typography>
                {error && <Alert severity="error">{error}</Alert>}

                <TextField label="Project Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} fullWidth />
                <TextField label="Idea" multiline minRows={3} value={form.idea} onChange={(e) => setForm({ ...form, idea: e.target.value })} fullWidth />
                <TextField label="Target Market" value={form.targetMarket} onChange={(e) => setForm({ ...form, targetMarket: e.target.value })} fullWidth />
                <TextField label="Constraints (optional)" multiline minRows={2} value={form.constraints} onChange={(e) => setForm({ ...form, constraints: e.target.value })} fullWidth />

                <Divider />
                <Stack direction="row" spacing={2}>
                    <Button variant="contained" onClick={handleGenerate} disabled={loading}>
                        {loading ? 'Generating…' : 'Generate PRD'}
                    </Button>
                    <Button variant="text" onClick={() => history.back()} disabled={loading}>
                        Cancel
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    );
}
