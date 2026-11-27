import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { CheckCircle } from "@untitledui/icons";
import { AppNavbar } from "@/components/application/app-navigation/app-navbar";
import { AvatarProfilePhoto } from "@/components/base/avatar/avatar-profile-photo";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { Toggle } from "@/components/base/toggle/toggle";
import { getDeckPreference, getJournalEntries, saveDeckPreference } from "@/utils/journal-storage";
import type { Profile, ZodiacSign } from "@/utils/profile";
import { getInitials, getProfile, resizeProfilePhoto, saveProfile, useProfile, zodiacSigns } from "@/utils/profile";
import { getEmailError } from "@/utils/validation";

type SectionId = "personal" | "deck" | "astrology";
type SectionStatus = { section: SectionId; state: "saved" | "failed" } | null;

const NOT_SURE = "not-sure";
const signOptions = [{ id: NOT_SURE, label: "Not sure" }, ...zodiacSigns.map((sign) => ({ id: sign, label: sign }))];

const memberSinceFormat = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

/** How long to wait after the last keystroke before saving a text field. */
const TYPING_DELAY_MS = 600;
const SAVED_MESSAGE_MS = 2000;

const Section = ({ title, description, status, children }: { title: string; description: string; status?: SectionStatus; children: ReactNode }) => (
    <section className="grid gap-5 border-t border-secondary py-6 lg:grid-cols-[minmax(200px,280px)_minmax(0,512px)] lg:gap-8">
        <div>
            <h2 className="text-sm font-semibold text-secondary">{title}</h2>
            <p className="mt-1 text-sm text-tertiary">{description}</p>
            <p role="status" className="mt-2 text-sm">
                {status?.state === "saved" && (
                    <span className="flex items-center gap-1.5 text-success-primary">
                        <CheckCircle aria-hidden="true" className="size-4" />
                        Saved
                    </span>
                )}
                {status?.state === "failed" && <span className="text-error-primary">Couldn't save. Try a smaller photo.</span>}
            </p>
        </div>
        <div className="flex flex-col gap-5">{children}</div>
    </section>
);

const SignSelect = ({ label, value, onChange }: { label: string; value?: ZodiacSign; onChange: (sign?: ZodiacSign) => void }) => (
    <Select
        label={label}
        placeholder="Select a sign"
        items={signOptions}
        selectedKey={value ?? null}
        onSelectionChange={(key) => onChange(key === NOT_SURE || key === null ? undefined : (key as ZodiacSign))}
    >
        {(item) => <Select.Item id={item.id} label={item.label} />}
    </Select>
);

export const ProfileScreen = () => {
    const savedProfile = useProfile();
    const [initial] = useState(getProfile);
    const [name, setName] = useState(initial.name);
    const [email, setEmail] = useState(initial.email);
    const [deck, setDeck] = useState(getDeckPreference);
    const [entryCount, setEntryCount] = useState<number | null>(null);
    const [errors, setErrors] = useState<{ name?: string; email?: string; photo?: string }>({});
    const [status, setStatus] = useState<SectionStatus>(null);
    const photoInputRef = useRef<HTMLInputElement>(null);

    // Text fields save a moment after typing stops. Pending saves run right away on blur or when leaving the page.
    const pendingSaves = useRef(new Map<string, { timer: number; save: () => void }>());
    const statusTimer = useRef<number>(undefined);

    const showStatus = (section: SectionId, state: "saved" | "failed") => {
        window.clearTimeout(statusTimer.current);
        setStatus({ section, state });
        if (state === "saved") statusTimer.current = window.setTimeout(() => setStatus(null), SAVED_MESSAGE_MS);
    };

    /** Saves only the given fields, so one section never overwrites another. */
    const saveFields = (section: SectionId, changes: Partial<Profile>) => {
        showStatus(section, saveProfile({ ...getProfile(), ...changes }) ? "saved" : "failed");
    };

    const saveAfterTyping = (key: string, save: () => void) => {
        const pending = pendingSaves.current.get(key);
        if (pending) window.clearTimeout(pending.timer);

        const run = () => {
            pendingSaves.current.delete(key);
            save();
        };
        pendingSaves.current.set(key, { timer: window.setTimeout(run, TYPING_DELAY_MS), save: run });
    };

    const saveNow = (key: string) => {
        const pending = pendingSaves.current.get(key);
        if (!pending) return;
        window.clearTimeout(pending.timer);
        pending.save();
    };

    useEffect(() => {
        const pending = pendingSaves.current;

        return () => {
            pending.forEach(({ timer, save }) => {
                window.clearTimeout(timer);
                save();
            });
            window.clearTimeout(statusTimer.current);
        };
    }, []);

    useEffect(() => {
        let isCurrent = true;

        getJournalEntries()
            .catch(() => [])
            .then((entries) => {
                if (!isCurrent) return;
                setEntryCount(entries.length);

                // Accounts made before the profile existed don't have a join date, so use the earliest entry instead.
                if (getProfile().memberSince === undefined) {
                    saveProfile({ ...getProfile(), memberSince: Math.min(Date.now(), ...entries.map((entry) => entry.updatedAt ?? Date.now())) });
                }
            });

        return () => {
            isCurrent = false;
        };
    }, []);

    const handleNameChange = (value: string) => {
        setName(value);
        setErrors((current) => ({ ...current, name: undefined }));
        // Invalid values just aren't saved while typing. The error shows once you leave the field.
        saveAfterTyping("name", () => {
            if (value.trim()) saveFields("personal", { name: value.trim() });
        });
    };

    const handleNameBlur = () => {
        saveNow("name");
        if (!name.trim()) setErrors((current) => ({ ...current, name: "Enter your name." }));
    };

    const handleEmailChange = (value: string) => {
        setEmail(value);
        setErrors((current) => ({ ...current, email: undefined }));
        saveAfterTyping("email", () => {
            if (!getEmailError(value.trim())) saveFields("personal", { email: value.trim() });
        });
    };

    const handleEmailBlur = () => {
        saveNow("email");
        const error = getEmailError(email.trim());
        if (error) setErrors((current) => ({ ...current, email: error }));
    };

    const handlePhoto = async (file?: File) => {
        if (!file) return;

        try {
            const photo = await resizeProfilePhoto(file);
            setErrors((current) => ({ ...current, photo: undefined }));
            saveFields("personal", { photo });
        } catch {
            setErrors((current) => ({ ...current, photo: "That image couldn't be read. Try a JPG or PNG." }));
        }
    };

    const saveDeck = (hasDeck: boolean, deckName?: string) => {
        const trimmed = deckName?.trim();
        saveDeckPreference({ hasDeck, deckName: hasDeck && trimmed ? trimmed : undefined });
        showStatus("deck", "saved");
    };

    const handleDeckToggle = (hasDeck: boolean) => {
        setDeck((current) => ({ ...current, hasDeck }));
        pendingSaves.current.delete("deckName");
        saveDeck(hasDeck, deck.deckName);
    };

    const handleDeckNameChange = (deckName: string) => {
        setDeck((current) => ({ ...current, deckName }));
        saveAfterTyping("deckName", () => saveDeck(true, deckName));
    };

    const sectionStatus = (section: SectionId) => (status?.section === section ? status : null);

    return (
        <div className="min-h-dvh bg-primary">
            <AppNavbar />

            <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
                <h1 className="text-display-xs font-semibold text-primary">Profile</h1>

                <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
                    <AvatarProfilePhoto
                        size="md"
                        src={savedProfile.photo}
                        alt={savedProfile.name || "Your profile"}
                        initials={getInitials(savedProfile.name) || undefined}
                    />
                    <div className="min-w-0">
                        <p className="text-xl font-semibold text-primary">{savedProfile.name || "Your name"}</p>
                        {savedProfile.email && <p className="mt-0.5 text-md [overflow-wrap:anywhere] text-tertiary">{savedProfile.email}</p>}
                        <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                            {savedProfile.memberSince !== undefined && (
                                <div className="flex gap-1.5">
                                    <dt className="text-tertiary">Member since</dt>
                                    <dd className="font-medium text-secondary">{memberSinceFormat.format(savedProfile.memberSince)}</dd>
                                </div>
                            )}
                            {entryCount !== null && (
                                <div className="flex gap-1.5">
                                    <dt className="text-tertiary">Total entries</dt>
                                    <dd className="font-medium text-secondary">{entryCount}</dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>

                <div className="mt-8 border-b border-secondary">
                    <Section title="Personal info" description="Your photo, name and email." status={sectionStatus("personal")}>
                        <div className="flex items-center gap-4">
                            <AvatarProfilePhoto size="sm" src={savedProfile.photo} alt="" initials={getInitials(savedProfile.name) || undefined} />
                            <div className="flex flex-wrap gap-3">
                                <Button color="secondary" size="sm" onPress={() => photoInputRef.current?.click()}>
                                    {savedProfile.photo ? "Change photo" : "Upload photo"}
                                </Button>
                                {savedProfile.photo && (
                                    <Button color="tertiary" size="sm" onPress={() => saveFields("personal", { photo: undefined })}>
                                        Remove
                                    </Button>
                                )}
                            </div>
                            <input
                                ref={photoInputRef}
                                type="file"
                                accept="image/*"
                                aria-label="Upload profile photo"
                                className="hidden"
                                onChange={(event) => {
                                    void handlePhoto(event.target.files?.[0]);
                                    event.target.value = "";
                                }}
                            />
                        </div>
                        {errors.photo && <p className="-mt-3 text-sm text-error-primary">{errors.photo}</p>}

                        <Input
                            label="Name"
                            autoComplete="name"
                            value={name}
                            onChange={handleNameChange}
                            onBlur={handleNameBlur}
                            isInvalid={!!errors.name}
                            hint={errors.name}
                        />
                        <Input
                            label="Email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={handleEmailChange}
                            onBlur={handleEmailBlur}
                            isInvalid={!!errors.email}
                            hint={errors.email}
                        />
                    </Section>

                    <Section
                        title="My deck"
                        description="Decides whether the Journal Post Editor asks you to log your own card or pull one in the app."
                        status={sectionStatus("deck")}
                    >
                        <Toggle
                            label="I own a tarot deck"
                            hint="Log the cards you pull from your own deck."
                            isSelected={deck.hasDeck}
                            onChange={handleDeckToggle}
                        />
                        {deck.hasDeck && (
                            <Input
                                label="Deck name"
                                placeholder="e.g. Rider-Waite"
                                value={deck.deckName ?? ""}
                                onChange={handleDeckNameChange}
                                onBlur={() => saveNow("deckName")}
                            />
                        )}
                    </Section>

                    <Section title="Astrology" description="Your big three." status={sectionStatus("astrology")}>
                        <SignSelect label="Sun sign" value={savedProfile.sunSign} onChange={(sunSign) => saveFields("astrology", { sunSign })} />
                        <SignSelect label="Moon sign" value={savedProfile.moonSign} onChange={(moonSign) => saveFields("astrology", { moonSign })} />
                        <SignSelect label="Rising sign" value={savedProfile.risingSign} onChange={(risingSign) => saveFields("astrology", { risingSign })} />
                    </Section>
                </div>
            </main>
        </div>
    );
};
