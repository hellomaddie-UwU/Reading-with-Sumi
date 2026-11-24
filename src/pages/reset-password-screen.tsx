import type { FormEvent } from "react";
import { useState } from "react";
import { ArrowLeft, CheckCircle, Key01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { UntitledLogo } from "@/components/foundations/logo/untitledui-logo";

type Errors = { password?: string; confirmPassword?: string };

export const ResetPasswordScreen = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<Errors>({});
    const [isReset, setIsReset] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors: Errors = {
            password: password ? undefined : "Enter a new password.",
            confirmPassword: !confirmPassword ? "Confirm your new password." : confirmPassword === password ? undefined : "Passwords don't match.",
        };
        setErrors(nextErrors);

        // Placeholder until the backend saves the new password.
        if (!nextErrors.password && !nextErrors.confirmPassword) setIsReset(true);
    };

    return (
        <main className="flex min-h-dvh items-center justify-center bg-primary px-4 py-12">
            <div className="flex w-full max-w-sm flex-col items-center text-center">
                <UntitledLogo />

                {isReset ? (
                    <>
                        <FeaturedIcon icon={CheckCircle} color="success" theme="light" size="lg" className="mt-8" />
                        <h1 className="mt-6 text-display-xs font-semibold text-primary">Password reset</h1>
                        <p className="mt-2 text-md text-tertiary">Your password has been reset. You can now log in with your new password.</p>
                        <Button href="/" size="lg" className="mt-8 w-full">
                            Back to log in
                        </Button>
                    </>
                ) : (
                    <>
                        <FeaturedIcon icon={Key01} color="gray" theme="modern" size="lg" className="mt-8" />
                        <h1 className="mt-6 text-display-xs font-semibold text-primary">Set new password</h1>
                        <p className="mt-2 text-md text-tertiary">Choose a new password for your account.</p>

                        <Form validationBehavior="aria" onSubmit={handleSubmit} className="mt-8 flex w-full flex-col gap-5 text-left">
                            <Input
                                label="New password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Enter a new password"
                                value={password}
                                onChange={(value) => {
                                    setPassword(value);
                                    setErrors((current) => ({ ...current, password: undefined }));
                                }}
                                isInvalid={Boolean(errors.password)}
                                hint={errors.password}
                            />
                            <Input
                                label="Confirm password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Confirm your new password"
                                value={confirmPassword}
                                onChange={(value) => {
                                    setConfirmPassword(value);
                                    setErrors((current) => ({ ...current, confirmPassword: undefined }));
                                }}
                                isInvalid={Boolean(errors.confirmPassword)}
                                hint={errors.confirmPassword}
                            />
                            <Button type="submit" size="lg" className="w-full">
                                Reset password
                            </Button>
                        </Form>

                        <Button href="/" color="link-gray" size="sm" iconLeading={ArrowLeft} className="mt-6">
                            Back to log in
                        </Button>
                    </>
                )}
            </div>
        </main>
    );
};
