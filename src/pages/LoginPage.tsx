import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signIn, resetPassword, confirmResetPassword } from "aws-amplify/auth";
import { useAuthenticator } from "@aws-amplify/ui-react";

type ViewState = "login" | "forgotPassword" | "resetPassword";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [viewState, setViewState] = useState<ViewState>("login");
  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    if (user) {
      navigate("/app/newproject");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await signIn({ username: email, password });
      navigate("/app/newproject");
    } catch (err: any) {
      console.error("Login error:", err);

      if (err.name === "UserNotFoundException") {
        setError("No account found with this email.");
      } else if (err.name === "NotAuthorizedException") {
        setError("Incorrect email or password.");
      } else if (err.name === "UserNotConfirmedException") {
        setError("Please confirm your email before signing in.");
      } else {
        setError(
          err.message || "Failed to sign in. Please check your credentials.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await resetPassword({ username: email });
      setSuccess(`Password reset code sent to ${email}. Check your email.`);
      setViewState("resetPassword");
    } catch (err: any) {
      console.error("Forgot password error:", err);
      if (err.name === "UserNotFoundException") {
        setError("No account found with this email.");
      } else if (err.name === "LimitExceededException") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError(err.message || "Failed to send reset code.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      await confirmResetPassword({
        username: email,
        confirmationCode,
        newPassword,
      });
      setSuccess("Password reset successful! You can now sign in.");
      setViewState("login");
      setPassword("");
      setNewPassword("");
      setConfirmationCode("");
    } catch (err: any) {
      console.error("Reset password error:", err);
      if (err.name === "CodeMismatchException") {
        setError("Invalid verification code.");
      } else if (err.name === "ExpiredCodeException") {
        setError("Verification code expired. Please request a new one.");
      } else if (err.name === "InvalidPasswordException") {
        setError("Password does not meet requirements.");
      } else {
        setError(err.message || "Failed to reset password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const resetForm = () => {
    setError("");
    setSuccess("");
    setPassword("");
    setNewPassword("");
    setConfirmationCode("");
  };

  // Login View
  if (viewState === "login") {
    return (
      <Box
        sx={{
          minHeight: "75vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to your Elder Care Reminder account
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
                autoComplete="email"
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 1 }}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ textAlign: "right", mb: 2 }}>
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={() => {
                    resetForm();
                    setViewState("forgotPassword");
                  }}
                  sx={{ cursor: "pointer" }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ mb: 2 }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Link
                  component="button"
                  onClick={() => navigate("/register")}
                  sx={{ cursor: "pointer" }}
                >
                  Register here
                </Link>
              </Typography>
            </Box>

            <Box sx={{ textAlign: "center", mt: 1 }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/")}
                sx={{ cursor: "pointer" }}
              >
                Back to Home
              </Link>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  // Forgot Password View
  if (viewState === "forgotPassword") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                Reset Password
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter your email to receive a password reset code
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <form onSubmit={handleForgotPassword}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 3 }}
                autoComplete="email"
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ mb: 2 }}
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </Button>
            </form>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  resetForm();
                  setViewState("login");
                }}
                sx={{ cursor: "pointer" }}
              >
                Back to Sign In
              </Link>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  // Reset Password View (with code)
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Enter New Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter the code sent to {email}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleResetPassword}>
            <TextField
              label="Verification Code"
              type="text"
              fullWidth
              required
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="Enter 6-digit code"
            />
            <TextField
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              fullWidth
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 3 }}
              autoComplete="new-password"
              helperText="At least 8 characters"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowNewPassword} edge="end">
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Didn't receive code?{" "}
              <Link
                component="button"
                onClick={() => {
                  resetForm();
                  setViewState("forgotPassword");
                }}
                sx={{ cursor: "pointer" }}
              >
                Resend
              </Link>
            </Typography>
          </Box>

          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => {
                resetForm();
                setViewState("login");
              }}
              sx={{ cursor: "pointer" }}
            >
              Back to Sign In
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default LoginPage;
