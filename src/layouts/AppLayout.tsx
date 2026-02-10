// src/layouts/AppLayout.tsx
import { Box } from "@mui/material";
import TopNavBar from "../pages/components/TopNavBar";
import { Outlet, useLocation } from "react-router-dom";
import { Hub } from "aws-amplify/utils";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import "../amplifyConfig";

const client = generateClient<Schema>();

export default function AppLayout() {
  const { user } = useAuthenticator((context) => [context.user]);
  const navigate = useNavigate();
  const location = useLocation();
  const [quota, setQuota] = useState({ used: 0, limit: 5 });
  const [plan, setPlan] = useState("FREE");

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  // Handle redirects based on authentication state
  useEffect(() => {
    const isAuthRoute = location.pathname.startsWith("/app");
    const isPublicAuthRoute = ["/login", "/register"].includes(
      location.pathname,
    );

    if (!user && isAuthRoute) {
      // Not authenticated but trying to access protected route
      navigate("/login");
    } else if (user && isPublicAuthRoute) {
      // Authenticated but on login/register page
      navigate("/app/newproject");
    }
  }, [user, location.pathname, navigate]);

  async function loadUserProfile() {
    if (!user) return;

    try {
      // Load user profile
      const { data: profiles } = await client.models.UserProfile.list({
        filter: { userId: { eq: user.userId } },
      });

      if (profiles.length === 0) {
        setPlan("FREE");
        setQuota({ used: 0, limit: 5 });
      } else {
        const profile = profiles[0];
        setPlan(profile.plan || "FREE");

        // Check if month has reset
        const resetDate = new Date(profile.monthResetDate || "");
        const now = new Date();
        if (
          now.getMonth() !== resetDate.getMonth() ||
          now.getFullYear() !== resetDate.getFullYear()
        ) {
          // Reset counter
          await client.models.UserProfile.update({
            id: profile.id,
            generationsThisMonth: 0,
            monthResetDate: new Date().toISOString(),
          });
          setQuota({ used: 0, limit: getPlanLimit(profile.plan || "FREE") });
        } else {
          setQuota({
            used: profile.generationsThisMonth || 0,
            limit: getPlanLimit(profile.plan || "FREE"),
          });
        }
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  }

  function getPlanLimit(plan: string): number {
    switch (plan) {
      case "FREE":
        return 5;
      case "PRO":
        return 50;
      case "ENTERPRISE":
        return 999999;
      default:
        return 5;
    }
  }

  // Listen for auth events
  useEffect(() => {
    const listener = ({ payload }: any) => {
      switch (payload.event) {
        case "signedOut":
          navigate("/");
          break;
        case "signedIn":
          navigate("/app/newproject");
          break;
      }
    };
    Hub.listen("auth", listener);
  }, [navigate]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <TopNavBar isAuthenticated={!!user} plan={plan} quota={quota} />
      <Box sx={{ flexGrow: 1, mt: 8, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
