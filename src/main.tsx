import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { ArchiveScreen } from "@/pages/archive-screen";
import { AuthScreen } from "@/pages/auth-screen";
import { DashboardScreen } from "@/pages/dashboard-screen";
import { ForgotPasswordScreen } from "@/pages/forgot-password-screen";
import { JournalPostEditorScreen } from "@/pages/journal-post-editor-screen";
import { LearningHubScreen } from "@/pages/learning-hub-screen";
import { MyJourneyScreen } from "@/pages/my-journey-screen";
import { NotFound } from "@/pages/not-found";
import { OnboardingScreen } from "@/pages/onboarding-screen";
import { ProfileScreen } from "@/pages/profile-screen";
import { ResetPasswordScreen } from "@/pages/reset-password-screen";
import { VerifyEmailScreen } from "@/pages/verify-email-screen";
import { RouteProvider } from "@/providers/router-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "@/styles/globals.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <BrowserRouter>
                <RouteProvider>
                    <Routes>
                        <Route path="/" element={<AuthScreen />} />
                        <Route path="/verify" element={<VerifyEmailScreen />} />
                        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
                        <Route path="/reset-password" element={<ResetPasswordScreen />} />
                        <Route path="/onboarding" element={<OnboardingScreen />} />
                        <Route path="/dashboard" element={<DashboardScreen />} />
                        <Route path="/journal-post-editor/:entryId" element={<JournalPostEditorScreen />} />
                        <Route path="/learning-hub" element={<LearningHubScreen />} />
                        <Route path="/archive" element={<ArchiveScreen />} />
                        <Route path="/my-journey" element={<MyJourneyScreen />} />
                        <Route path="/profile" element={<ProfileScreen />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </RouteProvider>
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>,
);
