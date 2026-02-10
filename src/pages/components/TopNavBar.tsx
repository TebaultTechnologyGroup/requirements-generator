import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";

export default function TopNavBar(props: {
  isAuthenticated: boolean;
  plan: string;
  quota: { used: number; limit: number };
}) {
  const { isAuthenticated, plan, quota } = props;
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const navigate = useNavigate();

  const handleSignInOut = async () => {
    try {
      if (isAuthenticated) {
        await signOut();
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="inherit"
      sx={{ borderBottom: "1px solid #eee" }}
    >
      <Toolbar sx={{ display: "flex", gap: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          AI PRD Generator
        </Typography>

        {isAuthenticated && (
          <Stack direction="row" spacing={1} alignItems="center" mr={2}>
            <Chip label={`Plan: ${plan}`} size="small" />
            <Chip label={`Usage: ${quota.used}/${quota.limit}`} size="small" />
            <Button variant="outlined" size="small">
              Upgrade
            </Button>
          </Stack>
        )}

        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2">
            {user?.signInDetails?.loginId}
          </Typography>
          <Button
            onClick={handleSignInOut}
            variant="contained"
            color="primary"
            size="small"
          >
            {isAuthenticated ? "Sign out" : "Sign in"}
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
