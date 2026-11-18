import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthScreen } from "@/pages/auth-screen";
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
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </RouteProvider>
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>,
);
