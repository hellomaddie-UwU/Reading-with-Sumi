import type { FormEvent } from "react";
import { useState } from "react";
import { ArrowLeft, Key01, Mail01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { UntitledLogo } from "@/components/foundations/logo/untitledui-logo";
import { getEmailError } from "@/utils/validation";

export const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState<string>();
    const [sentTo, setSentTo] = useState<string | null>(null);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedEmail = email.trim();
        const error = getEmailError(trimmedEmail);
        setEmailError(error);

        // Placeholder until the backend sends a real reset email.
        if (!error) setSentTo(trimmedEmail);
    };

    return (
        <main className="flex min-h-dvh items-center justify-center bg-primary px-4 py-12">
            <div className="flex w-full max-w-sm flex-col items-center text-center">
                <UntitledLogo />

                {sentTo === null ? (
                    <>
                        <FeaturedIcon icon={Key01} color="gray" theme="modern" size="lg" className="mt-8" />
                        <h1 className="mt-6 text-display-xs font-semibold text-primary">Forgot password?</h1>
                        <p className="mt-2 text-md text-tertiary">Enter your email and we'll send you a link to reset your password.</p>

                        <Form validationBehavior="aria" onSubmit={handleSubmit} className="mt-8 flex w-full flex-col gap-6 text-left">
                            <Input
                                label="Email"
                                type="email"
                                autoComplete="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(value) => {
                                    setEmail(value);
                                    setEmailError(undefined);
                                }}
                                isInvalid={Boolean(emailError)}
                                hint={emailError}
                            />
                            <Button type="submit" size="lg" className="w-full">
                                Send reset link
                            </Button>
                        </Form>
                    </>
                ) : (
                    <>
                        <FeaturedIcon icon={Mail01} color="gray" theme="modern" size="lg" className="mt-8" />
                        <h1 className="mt-6 text-display-xs font-semibold text-primary">Check your email</h1>
                        <p className="mt-2 text-md text-tertiary">
                            We sent a password reset link to <span className="font-medium [overflow-wrap:anywhere] text-secondary">{sentTo}</span>.
                        </p>

                        <Button href="/reset-password" size="lg" className="mt-8 w-full">
                            Open reset link
                        </Button>
                        <p className="mt-3 text-sm text-tertiary">No email is sent yet, so this button stands in for the link.</p>

                        <div className="mt-6 flex items-center gap-1 text-sm text-tertiary">
                            <span>Wrong email?</span>
                            <Button color="link-color" size="sm" onPress={() => setSentTo(null)}>
                                Try another
                            </Button>
                        </div>
                    </>
                )}

                <Button href="/" color="link-gray" size="sm" iconLeading={ArrowLeft} className="mt-6">
                    Back to log in
                </Button>
            </div>
        </main>
    );
};
