import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  CheckCircle,
  AutoAwesome,
  Security,
  Speed,
  TrendingUp,
  Code,
  CloudUpload,
} from "@mui/icons-material";
import { useAuthenticator } from "@aws-amplify/ui-react";

export default function LandingPage() {
  const { toSignIn } = useAuthenticator((context) => [context.toSignIn]);
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 8,
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                fontWeight="bold"
              >
                AI Product Requirements Generator
              </Typography>
              <Typography variant="h5" paragraph sx={{ opacity: 0.9 }}>
                Transform your product ideas into comprehensive PRDs with
                AI-powered analysis
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{ opacity: 0.8, mb: 4 }}
              >
                A demonstration of GenAI integration in a production-ready SaaS
                architecture. Generate detailed product requirements, user
                stories, risk analysis, and MVP scope recommendations in
                minutes.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={toSignIn}
                sx={{
                  bgcolor: "white",
                  color: "primary.main",
                  "&:hover": { bgcolor: "grey.100" },
                  px: 4,
                  py: 1.5,
                }}
                startIcon={<AutoAwesome />}
              >
                Get Started Free
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                sx={{
                  p: 3,
                  bgcolor: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Typography variant="h6" gutterBottom color="white">
                  ✨ Demo Features
                </Typography>
                <Box sx={{ color: "white", opacity: 0.9 }}>
                  <Typography variant="body2" paragraph>
                    • Free Tier: 5 PRDs/month
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Pro Tier: 50 PRDs/month
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Enterprise: Unlimited
                  </Typography>
                  <Typography variant="body2">
                    • Powered by Claude 3 Haiku
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Key Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          textAlign="center"
          mb={6}
        >
          Key Features
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <AutoAwesome
                  sx={{ fontSize: 40, color: "primary.main", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  AI-Powered Generation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Structured JSON outputs from AWS Bedrock (Claude 3 Haiku) with
                  comprehensive PRD components including goals, metrics, and
                  timelines.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Security sx={{ fontSize: 40, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Secure & Scalable
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Built with AWS Amplify Gen2, featuring Cognito authentication,
                  DynamoDB storage, and plan-based quota enforcement.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Speed sx={{ fontSize: 40, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Cost-Effective
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ~$0.004 per generation using Claude 3 Haiku. Even 1,000
                  generations/month costs less than $5.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Core Functionality Section */}
      <Box sx={{ bgcolor: "grey.50", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            textAlign="center"
            mb={6}
          >
            What You Get
          </Typography>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Comprehensive PRD Output
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Product Overview"
                      secondary="Goals and success metrics"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="User Stories"
                      secondary="With acceptance criteria"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Risk Analysis"
                      secondary="With mitigation strategies"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="MVP Scope"
                      secondary="In/out-of-scope features"
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Interactive Features
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Guided Multi-Step Form"
                      secondary="Material-UI Stepper interface"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Editable Results"
                      secondary="Interactive tabbed view"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Export to Markdown"
                      secondary="Download for documentation"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Generation History"
                      secondary="All PRDs saved to your account"
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Tech Stack Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          textAlign="center"
          mb={6}
        >
          Technology Stack
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Code sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Frontend
                </Typography>
                <Chip label="React 18.3" size="small" sx={{ m: 0.5 }} />
                <Chip label="TypeScript" size="small" sx={{ m: 0.5 }} />
                <Chip label="Material-UI" size="small" sx={{ m: 0.5 }} />
                <Chip label="Vite" size="small" sx={{ m: 0.5 }} />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <CloudUpload
                  sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                />
                <Typography variant="h6" gutterBottom>
                  Backend
                </Typography>
                <Chip label="AWS Amplify" size="small" sx={{ m: 0.5 }} />
                <Chip label="Lambda" size="small" sx={{ m: 0.5 }} />
                <Chip label="DynamoDB" size="small" sx={{ m: 0.5 }} />
                <Chip label="Cognito" size="small" sx={{ m: 0.5 }} />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <AutoAwesome
                  sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                />
                <Typography variant="h6" gutterBottom>
                  AI/ML
                </Typography>
                <Chip label="AWS Bedrock" size="small" sx={{ m: 0.5 }} />
                <Chip label="Claude 3 Haiku" size="small" sx={{ m: 0.5 }} />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <TrendingUp
                  sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                />
                <Typography variant="h6" gutterBottom>
                  Features
                </Typography>
                <Chip label="Authentication" size="small" sx={{ m: 0.5 }} />
                <Chip label="Usage Tracking" size="small" sx={{ m: 0.5 }} />
                <Chip label="Plan Quotas" size="small" sx={{ m: 0.5 }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Divider />

      {/* CTA Section */}
      <Box sx={{ bgcolor: "primary.main", color: "white", py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Ready to Generate Your First PRD?
          </Typography>
          <Typography variant="body1" paragraph sx={{ opacity: 0.9, mb: 4 }}>
            This is a portfolio demonstration project showcasing GenAI
            integration in a production-ready SaaS architecture.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={toSignIn}
            sx={{
              bgcolor: "white",
              color: "primary.main",
              "&:hover": { bgcolor: "grey.100" },
              px: 4,
              py: 1.5,
            }}
          >
            Sign In to Get Started
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "grey.900", color: "white", py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" textAlign="center" sx={{ opacity: 0.7 }}>
            Built for portfolio demonstration • SaaS billing component is mocked
            • MIT License
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
