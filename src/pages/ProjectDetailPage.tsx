
// src/pages/ProjectDetailPage.tsx
import { useParams } from '@tanstack/react-router';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

export default function ProjectDetailPage() {
    //const { id } = useParams({ from: '/project/$id' });
    const [tab, setTab] = useState(0);

    // TODO: fetch project by id from Amplify Data
    const project = {
        title: 'Sample Project',
        outputs: {
            prd: 'Executive summary, goals, non-goals, KPIs…',
            stories: '- As a user, I want…',
            risks: '- Risk: …',
            mvp: '- Scope for v0…',
        },
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h5" mb={2}>{project.title}</Typography>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                <Tab label="PRD" />
                <Tab label="User Stories" />
                <Tab label="Risks" />
                <Tab label="MVP Scope" />
            </Tabs>

            <Box component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'ui-monospace, Menlo, monospace' }}>
                {tab === 0 && project.outputs.prd}
                {tab === 1 && project.outputs.stories}
                {tab === 2 && project.outputs.risks}
                {tab === 3 && project.outputs.mvp}
            </Box>
        </Paper>
    );
}
