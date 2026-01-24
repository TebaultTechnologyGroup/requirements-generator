
// src/main.tsx
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { configureAmplify } from './lib/amplifyClient';
import { RouterProvider, createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@aws-amplify/ui-react/styles.css';
import AuthPage from './pages/AuthPage';
import { Authenticator } from '@aws-amplify/ui-react';
import DashboardPage from './pages/DashboardPage';
import NewProjectPage from './pages/NewProjectPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import UpgradePage from './pages/UpgradePage';
import AppLayout from './layouts/AppLayout';

configureAmplify();
const queryClient = new QueryClient();

// Root layout with AppLayout wrapper
const rootRoute = createRootRoute({
  component: () => (
    <Authenticator.Provider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <AppLayout>
            <Outlet />
          </AppLayout>
        </QueryClientProvider>
      </ThemeProvider>
    </Authenticator.Provider>
  ),
});

// Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const authRoute = createRoute({ getParentRoute: () => rootRoute, path: '/auth', component: AuthPage });
const newRoute = createRoute({ getParentRoute: () => rootRoute, path: '/new', component: NewProjectPage });
const projRoute = createRoute({ getParentRoute: () => rootRoute, path: '/project/$id', component: ProjectDetailPage });
const upgradeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/upgrade', component: UpgradePage });

const routeTree = rootRoute.addChildren([indexRoute, authRoute, newRoute, projRoute, upgradeRoute]);
const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
