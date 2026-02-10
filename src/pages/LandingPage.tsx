import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

export default function LandingPage() {
    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Stack spacing={6}>

                {/* Hero Section */}
                <Stack spacing={2} textAlign="center">
                    <Typography variant="h3" fontWeight={700}>
                        Requirements Generator
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Generate complete product requirement documents (PRDs) in minutes using AI.
                    </Typography>

                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                        <Button variant="contained" size="large">
                            Start Generating
                        </Button>
                        <Button variant="outlined" size="large">
                            View GitHub
                        </Button>
                    </Stack>
                </Stack>

                {/* Warning Banner */}
                <Paper elevation={3} sx={{ p: 3, borderLeft: '6px solid #d32f2f', backgroundColor: '#fff5f5' }}>
                    <Typography variant="body1" color="error" fontWeight={600}>
                        Demo Only — Do Not Upload Sensitive Data
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        This is a demonstration application. All data may be logged and monitored for abuse prevention and auditing.
                    </Typography>
                </Paper>

                {/* About Section */}
                <Box>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                        About This Project
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        The purpose of this application is to showcase how AI can automate and enhance product development workflows.
                        By providing a clear product idea, target market, and constraints, users can generate comprehensive product
                        requirement documents in minutes.
                        <br /><br />
                        This demo illustrates how GenAI features can be safely and cost‑effectively offered as a scalable service.
                        The system produces PRDs including user stories, risk analysis, and MVP scope recommendations.
                        <br /><br />
                        Built for portfolio demonstration — showcasing integration of modern GenAI capabilities into a
                        production‑ready SaaS architecture.
                    </Typography>

                    <Typography variant="body1" color="warning.main" sx={{ mt: 2 }}>
                        SaaS upgrade options are not yet implemented. All users currently have access to the same features and quotas.
                    </Typography>
                </Box>

                {/* Features Section */}
                <Box>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                        Key Features
                    </Typography>

                    <Stack spacing={2}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle1" fontWeight={600}>AI‑Generated PRDs</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Automatically produce structured product requirement documents from a simple prompt.
                            </Typography>
                        </Paper>

                        <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle1" fontWeight={600}>User Stories & MVP Scope</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Generate actionable user stories, acceptance criteria, and MVP recommendations.
                            </Typography>
                        </Paper>

                        <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle1" fontWeight={600}>Risk & Constraint Analysis</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Identify potential risks, dependencies, and constraints automatically.
                            </Typography>
                        </Paper>
                    </Stack>
                </Box>

                <Divider />

                {/* More Information */}
                <Box>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                        More Information
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        If you are interested in learning more about this project and how AI can streamline workflows in your organization,
                        <Link href="https://www.tebaulttechnologygroup.com" target="_blank" rel="noopener" sx={{ mx: 1 }}>
                            please visit my website
                        </Link>.
                        <br /><br />
                        To view the source code, contribute, or report issues, visit the GitHub repository:
                        <br />
                        <Link
                            href="https://github.com/TebaultTechnologyGroup/requirements-generator"
                            target="_blank"
                            rel="noopener"
                        >
                            Requirements Generator Repository
                        </Link>
                    </Typography>
                </Box>

            </Stack>
        </Container>
    );
}
