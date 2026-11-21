import { LogOut01, Settings01, User01 } from "@untitledui/icons";
import { Button as AriaButton, Link as AriaLink } from "react-aria-components";
import { useLocation, useNavigate } from "react-router";
import { Avatar } from "@/components/base/avatar/avatar";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { UntitledLogo } from "@/components/foundations/logo/untitledui-logo";
import { UntitledLogoMinimal } from "@/components/foundations/logo/untitledui-logo-minimal";
import { cx } from "@/utils/cx";

const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Learning Hub", href: "/learning-hub" },
];

export const AppNavbar = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    return (
        <header className="border-b border-secondary bg-primary">
            <nav aria-label="Main" className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3 md:px-8">
                <AriaLink
                    href="/dashboard"
                    aria-label="Reading with Sumi, go to Dashboard"
                    className="justify-self-start rounded-md outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                    <UntitledLogoMinimal className="size-8 md:hidden" />
                    <UntitledLogo className="max-md:hidden" />
                </AriaLink>

                <ul className="flex items-center gap-1">
                    {navLinks.map((link) => {
                        const isCurrent = pathname === link.href;

                        return (
                            <li key={link.href}>
                                <AriaLink
                                    href={link.href}
                                    aria-current={isCurrent ? "page" : undefined}
                                    className={cx(
                                        "block rounded-md px-2.5 py-2 text-sm font-semibold whitespace-nowrap outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 md:px-3",
                                        isCurrent ? "bg-active text-secondary" : "text-quaternary hover:bg-primary_hover hover:text-secondary_hover",
                                    )}
                                >
                                    {link.label}
                                </AriaLink>
                            </li>
                        );
                    })}
                </ul>

                <div className="justify-self-end">
                    <Dropdown.Root>
                        <AriaButton
                            aria-label="Open account menu"
                            className={({ isPressed, isFocusVisible }) =>
                                cx(
                                    "relative inline-flex cursor-pointer rounded-full outline-offset-2 outline-focus-ring",
                                    (isPressed || isFocusVisible) && "outline-2",
                                )
                            }
                        >
                            <Avatar size="md" alt="Your profile" />
                        </AriaButton>

                        <Dropdown.Popover className="w-48">
                            <Dropdown.Menu aria-label="Account" onAction={(key) => key === "log-out" && navigate("/")}>
                                <Dropdown.Item id="profile" icon={User01}>
                                    Profile
                                </Dropdown.Item>
                                <Dropdown.Item id="settings" icon={Settings01}>
                                    Settings
                                </Dropdown.Item>
                                <Dropdown.Separator />
                                <Dropdown.Item id="log-out" icon={LogOut01}>
                                    Log Out
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown.Popover>
                    </Dropdown.Root>
                </div>
            </nav>
        </header>
    );
};
