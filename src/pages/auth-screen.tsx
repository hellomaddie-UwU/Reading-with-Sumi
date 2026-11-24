import type { FormEvent } from "react";
import { useState } from "react";
import type { Key } from "react-aria-components";
import { useLocation, useNavigate } from "react-router";
import { Tabs } from "@/components/application/tabs/tabs";
import { ProductSlider } from "@/components/auth/product-slider";
import { Button } from "@/components/base/buttons/button";
import { SocialButton } from "@/components/base/buttons/social-button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { UntitledLogo } from "@/components/foundations/logo/untitledui-logo";
import { getEmailError } from "@/utils/validation";

type FieldErrors = Record<string, string | undefined>;

const getValue = (data: FormData, name: string) => String(data.get(name) ?? "");

const useFieldErrors = () => {
    const [errors, setErrors] = useState<FieldErrors>({});

    const getFieldProps = (name: string) => ({
        name,
        isInvalid: Boolean(errors[name]),
        hint: errors[name],
        onChange: () => setErrors((current) => ({ ...current, [name]: undefined })),
    });

    return { getFieldProps, setErrors };
};

const SocialSignIn = () => (
    <>
        <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border-secondary" />
            <span className="text-sm font-medium text-tertiary">OR</span>
            <div className="h-px flex-1 bg-border-secondary" />
        </div>

        <div className="flex flex-col gap-3">
            <SocialButton social="google" className="w-full">
                Continue with Google
            </SocialButton>
            <SocialButton social="apple" className="w-full">
                Continue with Apple
            </SocialButton>
        </div>
    </>
);

const LogInForm = () => {
    const { getFieldProps, setErrors } = useFieldErrors();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        setErrors({
            email: getEmailError(getValue(data, "email").trim()),
            password: getValue(data, "password") ? undefined : "Enter your password.",
        });
    };

    return (
        <Form validationBehavior="aria" onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input {...getFieldProps("email")} label="Email" type="email" autoComplete="email" placeholder="Enter your email" />
            <Input {...getFieldProps("password")} label="Password" type="password" autoComplete="current-password" placeholder="Enter your password" />

            <div className="flex items-center justify-between gap-3">
                <Checkbox name="remember" label="Remember me" />
                <Button href="/forgot-password" color="link-color" size="sm">
                    Forgot password
                </Button>
            </div>

            <Button type="submit" size="lg" className="w-full">
                Log in
            </Button>
        </Form>
    );
};

const SignUpForm = ({ defaultName, defaultEmail }: { defaultName?: string; defaultEmail?: string }) => {
    const navigate = useNavigate();
    const { getFieldProps, setErrors } = useFieldErrors();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = getValue(data, "name").trim();
        const email = getValue(data, "email").trim();
        const password = getValue(data, "password");
        const confirmPassword = getValue(data, "confirmPassword");

        const errors = {
            name: name ? undefined : "Enter your name.",
            email: getEmailError(email),
            password: password ? undefined : "Enter a password.",
            confirmPassword: !confirmPassword ? "Confirm your password." : confirmPassword === password ? undefined : "Passwords don't match.",
        };

        setErrors(errors);

        if (Object.values(errors).every((error) => !error)) {
            navigate("/verify", { state: { name, email } });
        }
    };

    return (
        <Form validationBehavior="aria" onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input {...getFieldProps("name")} label="Name" autoComplete="name" placeholder="Enter your name" defaultValue={defaultName} />
            <Input {...getFieldProps("email")} label="Email" type="email" autoComplete="email" placeholder="Enter your email" defaultValue={defaultEmail} />
            <Input {...getFieldProps("password")} label="Password" type="password" autoComplete="new-password" placeholder="Create a password" />
            <Input
                {...getFieldProps("confirmPassword")}
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                placeholder="Confirm your password"
            />

            <Button type="submit" size="lg" className="w-full">
                Sign up
            </Button>
        </Form>
    );
};

export const AuthScreen = () => {
    const { state } = useLocation();
    const { tab, name, email } = (state ?? {}) as { tab?: Key; name?: string; email?: string };
    const [selectedTab, setSelectedTab] = useState<Key>(tab ?? "login");

    return (
        <main className="grid min-h-dvh bg-primary lg:grid-cols-2">
            <div className="flex flex-col px-4 py-8 md:px-8">
                <UntitledLogo />

                <div className="flex flex-1 items-center justify-center py-12">
                    <div className="w-full max-w-sm">
                        <h1 className="mb-6 text-display-xs font-semibold text-primary">
                            {selectedTab === "login" ? "Log in to your account" : "Create an account"}
                        </h1>

                        <Tabs selectedKey={selectedTab} onSelectionChange={setSelectedTab}>
                            <Tabs.List type="button-border" size="sm" fullWidth aria-label="Log in or sign up">
                                <Tabs.Item id="login">Log in</Tabs.Item>
                                <Tabs.Item id="signup">Sign up</Tabs.Item>
                            </Tabs.List>

                            <Tabs.Panel id="login" className="mt-6">
                                <LogInForm />
                            </Tabs.Panel>
                            <Tabs.Panel id="signup" className="mt-6">
                                <SignUpForm defaultName={name} defaultEmail={email} />
                            </Tabs.Panel>
                        </Tabs>

                        <SocialSignIn />
                    </div>
                </div>
            </div>

            <aside className="sticky top-0 hidden h-dvh self-start bg-brand-solid p-8 lg:block">
                <ProductSlider />
            </aside>
        </main>
    );
};
