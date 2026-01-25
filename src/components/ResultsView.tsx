import { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Tab,
} from '@mui/material';
import {
    ExpandMore,
    Refresh,
    Download,
    CheckCircle,
    Assignment,
} from '@mui/icons-material';

interface ResultsViewProps {
    result: {
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
    };
    formData: {
        idea: string;
        targetMarket: string;
        constraints: string;
        additionalContext: string;
    };
    onReset: () => void;
}

export default function ResultsView({ result, formData, onReset }: ResultsViewProps) {
    const [tabValue, setTabValue] = useState(0);

    const handleExportMarkdown = () => {
        const markdown = generateMarkdown();
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'product-requirements.md';
        a.click();
        URL.revokeObjectURL(url);
    };

    const generateMarkdown = () => {
        return `# Product Requirements Document

## Product Overview
${result.productRequirements.overview}

## Goals
${result.productRequirements.goals.map(goal => `- ${goal}`).join('\n')}

## Success Metrics
${result.productRequirements.successMetrics.map(metric => `- ${metric}`).join('\n')}

## User Stories
${result.userStories.map((story, i) => `
### User Story ${i + 1}
**As a** ${story.role}  
**I want to** ${story.action}  
**So that** ${story.benefit}

**Acceptance Criteria:**
${story.acceptanceCriteria.map(criterion => `- ${criterion}`).join('\n')}
`).join('\n')}

## Risk Analysis
${result.risks.map((risk, i) => `
### Risk ${i + 1}: ${risk.category}
**Description:** ${risk.description}  
**Likelihood:** ${risk.likelihood}  
**Impact:** ${risk.impact}  
**Mitigation:** ${risk.mitigation}
`).join('\n')}

## MVP Scope

### In Scope
${result.mvpScope.inScope.map(item => `- ${item}`).join('\n')}

### Out of Scope
${result.mvpScope.outOfScope.map(item => `- ${item}`).join('\n')}

### Timeline
${result.mvpScope.timeline}

### Assumptions
${result.mvpScope.assumptions.map(assumption => `- ${assumption}`).join('\n')}

---

## Input Summary

**Product Idea:** ${formData.idea}

**Target Market:** ${formData.targetMarket}

${formData.constraints ? `**Constraints:** ${formData.constraints}` : ''}

${formData.additionalContext ? `**Additional Context:** ${formData.additionalContext}` : ''}
`;
    };

    const getRiskColor = (level: string) => {
        switch (level.toLowerCase()) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'success';
            default: return 'default';
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Product Requirements Document
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<Download />}
                        onClick={handleExportMarkdown}
                    >
                        Export Markdown
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Refresh />}
                        onClick={onReset}
                    >
                        New PRD
                    </Button>
                </Box>
            </Box>

            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 3 }}>
                <Tab label="Overview" />
                <Tab label="User Stories" />
                <Tab label="Risks" />
                <Tab label="MVP Scope" />
            </Tabs>

            {tabValue === 0 && (
                <Box>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom color="primary">
                            Product Overview
                        </Typography>
                        <Typography paragraph>
                            {result.productRequirements.overview}
                        </Typography>
                    </Paper>

                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom color="primary">
                            <CheckCircle sx={{ verticalAlign: 'middle', mr: 1 }} />
                            Goals
                        </Typography>
                        <Box component="ul" sx={{ pl: 2 }}>
                            {result.productRequirements.goals.map((goal, i) => (
                                <Typography component="li" key={i} sx={{ mb: 1 }}>
                                    {goal}
                                </Typography>
                            ))}
                        </Box>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom color="primary">
                            <Assignment sx={{ verticalAlign: 'middle', mr: 1 }} />
                            Success Metrics
                        </Typography>
                        <Box component="ul" sx={{ pl: 2 }}>
                            {result.productRequirements.successMetrics.map((metric, i) => (
                                <Typography component="li" key={i} sx={{ mb: 1 }}>
                                    {metric}
                                </Typography>
                            ))}
                        </Box>
                    </Paper>
                </Box>
            )}

            {tabValue === 1 && (
                <Box>
                    {result.userStories.map((story, index) => (
                        <Accordion key={index} defaultExpanded={index === 0}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="h6">
                                    User Story {index + 1}: {story.role}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box>
                                    <Typography variant="body1" paragraph>
                                        <strong>As a</strong> {story.role}
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        <strong>I want to</strong> {story.action}
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        <strong>So that</strong> {story.benefit}
                                    </Typography>

                                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                                        Acceptance Criteria:
                                    </Typography>
                                    <Box component="ul" sx={{ pl: 2 }}>
                                        {story.acceptanceCriteria.map((criterion, i) => (
                                            <Typography component="li" key={i} sx={{ mb: 1 }}>
                                                {criterion}
                                            </Typography>
                                        ))}
                                    </Box>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            )}

            {tabValue === 2 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Category</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Likelihood</TableCell>
                                <TableCell>Impact</TableCell>
                                <TableCell>Mitigation</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {result.risks.map((risk, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Chip label={risk.category} size="small" />
                                    </TableCell>
                                    <TableCell>{risk.description}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={risk.likelihood}
                                            size="small"
                                            color={getRiskColor(risk.likelihood)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={risk.impact}
                                            size="small"
                                            color={getRiskColor(risk.impact)}
                                        />
                                    </TableCell>
                                    <TableCell>{risk.mitigation}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {tabValue === 3 && (
                <Box>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom color="success.main">
                            ✓ In Scope for MVP
                        </Typography>
                        <Box component="ul" sx={{ pl: 2 }}>
                            {result.mvpScope.inScope.map((item, i) => (
                                <Typography component="li" key={i} sx={{ mb: 1 }}>
                                    {item}
                                </Typography>
                            ))}
                        </Box>
                    </Paper>

                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom color="warning.main">
                            ✗ Out of Scope (Future Iterations)
                        </Typography>
                        <Box component="ul" sx={{ pl: 2 }}>
                            {result.mvpScope.outOfScope.map((item, i) => (
                                <Typography component="li" key={i} sx={{ mb: 1 }}>
                                    {item}
                                </Typography>
                            ))}
                        </Box>
                    </Paper>

                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom color="primary">
                            Timeline
                        </Typography>
                        <Typography>{result.mvpScope.timeline}</Typography>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom color="primary">
                            Key Assumptions
                        </Typography>
                        <Box component="ul" sx={{ pl: 2 }}>
                            {result.mvpScope.assumptions.map((assumption, i) => (
                                <Typography component="li" key={i} sx={{ mb: 1 }}>
                                    {assumption}
                                </Typography>
                            ))}
                        </Box>
                    </Paper>
                </Box>
            )}
        </Box>
    );
}