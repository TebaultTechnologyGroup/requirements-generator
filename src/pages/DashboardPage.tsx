
// src/pages/DashboardPage.tsx
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Link } from '@tanstack/react-router';

// Placeholder projects (we’ll replace with Amplify Data soon)
type Project = { id: string; title: string; createdAt: string };

export default function DashboardPage() {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        // TODO: fetch from Amplify Data
        setProjects([]);
    }, []);

    return (
        <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">Your Projects</Typography>
                <Button variant="contained" component={Link} to="/new">New Project</Button>
            </Stack>

            {projects.length === 0 ? (
                <Card>
                    <CardContent>
                        <Typography variant="body1" color="text.secondary">
                            No projects yet. Click <b>New Project</b> to generate your first PRD.
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={2}>
                    {projects.map((p) => (
                        <Grid key={p.id} size={{ xs: 12, md: 6, lg: 4 }}>
                            <Card component={Link} to={`/project/${p.id}`} style={{ textDecoration: 'none' }}>
                                <CardContent>
                                    <Typography variant="subtitle1">{p.title}</Typography>
                                    <Typography variant="caption" color="text.secondary">{new Date(p.createdAt).toLocaleString()}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Stack>
    );
}
