// src/layouts/AppLayout.tsx
import { Box } from "@mui/material";
import TopNavBar from "../pages/components/TopNavBar";
import { Outlet } from "react-router-dom";
import { Hub } from "aws-amplify/utils";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import "../amplifyConfig";

const client = generateClient<Schema>();

export default function AppLayout() {
  const { user } = useAuthenticator();
  const navigate = useNavigate();
  const [setUserProfile] = useState<any>(null);
  const [quota, setQuota] = useState({ used: 0, limit: 5 });
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const [plan] = useState("FREE");

  useEffect(() => {
    if (user) {
      loadUserProfile();
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  useEffect(() => {
    // if the user is not authenticated and trying to access /app, redirect to /
    if (isAuthenticated === false && location.pathname.startsWith("/app")) {
      navigate("/");
      // else if the user is authenticated and trying to access /login or /register, redirect to /app/newproject
    } else if (
      isAuthenticated === true &&
      !location.pathname.startsWith("/app")
    ) {
      navigate("/app/newproject");
    }
  }, [isAuthenticated, location.pathname, navigate]);

  async function loadUserProfile() {
    if (!user) return;
    try {
      // Load user profile
      const { data: profiles } = await client.models.UserProfile.list({
        filter: { userId: { eq: user.userId } },
      });

      if (profiles.length === 0) {
        // Create new profile with FREE plan
        const newProfile = await client.models.UserProfile.create({
          userId: user.userId,
          email: user.signInDetails?.loginId || "",
          organization: "",
          plan: "FREE",
          generationsThisMonth: 0,
          monthResetDate: new Date().toISOString(),
        });
        setUserProfile(newProfile.data);
        setQuota({ used: 0, limit: 5 });
      } else {
        const profile = profiles[0];
        setUserProfile(profile);

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
          setQuota({ used: 0, limit: getPlanLimit(profile.plan ?? 5) });
        } else {
          setQuota({
            used: profile.generationsThisMonth || 0,
            limit: getPlanLimit(profile.plan ?? 5),
          });
        }
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  }

  function getPlanLimit(plan: string | number): number {
    const planStr = String(plan);
    switch (planStr) {
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

  useEffect(() => {
    if (isAuthenticated === false && location.pathname.startsWith("/app")) {
      navigate("/");
    } else if (
      isAuthenticated === true &&
      !location.pathname.startsWith("/app")
    ) {
      navigate("/app/newproject");
    }
  }, [isAuthenticated, navigate]);

  // Listen for sign out events
  Hub.listen("auth", ({ payload }) => {
    switch (payload.event) {
      case "signedOut":
        setIsAuthenticated(false);
        navigate("/");
        break;
      default:
    }
  });

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <TopNavBar isAuthenticated={isAuthenticated} plan={plan} quota={quota} />
      <Box sx={{ flexGrow: 1, mt: 5, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
