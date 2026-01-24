
// src/layouts/AppLayout.tsx
import { PropsWithChildren } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Link } from '@tanstack/react-router';

type Props = PropsWithChildren<{
  plan?: 'FREE' | 'PRO' | 'ENTERPRISE';
  usage?: { used: number; limit: number };
}>;

export default function AppLayout({ children, plan = 'FREE', usage = { used: 0, limit: 5 } }: Props) {
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" elevation={0} color="inherit" sx={{ borderBottom: '1px solid #eee' }}>
        <Toolbar sx={{ display: 'flex', gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            AI PRD Generator
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" mr={2}>
            <Chip label={`Plan: ${plan}`} size="small" />
            <Chip label={`Usage: ${usage.used}/${usage.limit}`} size="small" />
            <Button variant="outlined" size="small" component={Link} to="/upgrade">
              Upgrade
            </Button>
          </Stack>

          {user ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2">{user?.signInDetails?.loginId}</Typography>
              <Button onClick={signOut} variant="contained" color="primary" size="small">
                Sign out
              </Button>
            </Stack>
          ) : (
            <Button variant="contained" component={Link} to="/auth">
              Sign in
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Toolbar /> {/* offset for fixed appbar */}
      <Container maxWidth="lg" sx={{ py: 6 }}>{children}</Container>
    </Box>
  );
}
