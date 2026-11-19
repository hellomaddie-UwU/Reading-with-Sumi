import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthScreen } from "@/pages/auth-screen";
import { DashboardScreen } from "@/pages/dashboard-screen";
import { JournalPostEditorScreen } from "@/pages/journal-post-editor-screen";
import { LearningHubScreen } from "@/pages/learning-hub-screen";
import { NotFound } from "@/pages/not-found";
import { OnboardingScreen } from "@/pages/onboarding-screen";
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
                        <Route path="/onboarding" element={<OnboardingScreen />} />
                        <Route path="/dashboard" element={<DashboardScreen />} />
                        <Route path="/journal-post-editor/:entryId" element={<JournalPostEditorScreen />} />
                        <Route path="/learning-hub" element={<LearningHubScreen />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </RouteProvider>
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>,
);
