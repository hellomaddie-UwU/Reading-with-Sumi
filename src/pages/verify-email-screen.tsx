import { useEffect, useState } from "react";
import { ArrowLeft } from "@untitledui/icons";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/base/buttons/button";
import { PinInput } from "@/components/base/input/pin-input";
import { UntitledLogo } from "@/components/foundations/logo/untitledui-logo";
import { getProfile, saveProfile } from "@/utils/profile";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

// Placeholder until the backend sends and checks real codes.
const DEMO_CODE = "123456";

export const VerifyEmailScreen = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { name, email } = (state ?? {}) as { name?: string; email?: string };

    const [code, setCode] = useState("");
    const [isInvalid, setIsInvalid] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

    useEffect(() => {
        if (secondsLeft <= 0) return;

        const timer = window.setTimeout(() => setSecondsLeft((seconds) => seconds - 1), 1000);
        return () => window.clearTimeout(timer);
    }, [secondsLeft]);

    const handleCodeChange = (value: string) => {
        setCode(value);
        setIsInvalid(false);

        if (value.length < CODE_LENGTH) return;

        if (value === DEMO_CODE) {
            saveProfile({ ...getProfile(), name: name ?? "", email: email ?? "", memberSince: Date.now() });
            navigate("/onboarding");
        } else {
            setCode("");
            setIsInvalid(true);
        }
    };

    const handleResend = () => {
        setCode("");
        setIsInvalid(false);
        setSecondsLeft(RESEND_SECONDS);
    };

    return (
        <main className="flex min-h-dvh items-center justify-center bg-primary px-4 py-12">
            <div className="flex w-full max-w-sm flex-col items-center text-center">
                <UntitledLogo />

                <h1 className="mt-8 text-display-xs font-semibold text-primary">Check your email</h1>
                <p className="mt-2 text-md text-tertiary">
                    We sent a {CODE_LENGTH}-digit code to{" "}
                    {email ? <span className="font-medium [overflow-wrap:anywhere] text-secondary">{email}</span> : "your email"}.
                </p>

                <PinInput size="xs" invalid={isInvalid} className="mt-8 items-center">
                    <PinInput.Label className="sr-only">Verification code</PinInput.Label>
                    <PinInput.Group
                        autoFocus
                        maxLength={CODE_LENGTH}
                        value={code}
                        onChange={handleCodeChange}
                        pattern={REGEXP_ONLY_DIGITS}
                        autoComplete="one-time-code"
                    >
                        {Array.from({ length: CODE_LENGTH }, (_, index) => (
                            <PinInput.Slot key={index} index={index} />
                        ))}
                    </PinInput.Group>
                    {isInvalid && <PinInput.Description isInvalid>That code isn't right. Try again.</PinInput.Description>}
                </PinInput>

                <div className="mt-8 flex items-center gap-1 text-sm text-tertiary">
                    <span>Didn't get the code?</span>
                    {secondsLeft > 0 ? (
                        <span className="font-medium text-secondary">Resend in {secondsLeft}s</span>
                    ) : (
                        <Button color="link-color" size="sm" onPress={handleResend}>
                            Resend code
                        </Button>
                    )}
                </div>

                <Button
                    color="link-gray"
                    size="sm"
                    iconLeading={ArrowLeft}
                    className="mt-6"
                    onPress={() => navigate("/", { state: { tab: "signup", name, email } })}
                >
                    Back to sign up
                </Button>
            </div>
        </main>
    );
};
