import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AppNavbar } from "@/components/application/app-navigation/app-navbar";
import { Button } from "@/components/base/buttons/button";
import { JournalEntryCard } from "@/components/journal/journal-entry-card";
import type { JournalEntry } from "@/utils/journal-storage";
import { getJournalEntries } from "@/utils/journal-storage";

export const DashboardScreen = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState<JournalEntry[] | null>(null);

    useEffect(() => {
        let isCurrent = true;

        getJournalEntries()
            .catch(() => [])
            .then((savedEntries) => {
                if (isCurrent) setEntries(savedEntries);
            });

        return () => {
            isCurrent = false;
        };
    }, []);

    return (
        <div className="min-h-dvh bg-primary">
            <AppNavbar />

            <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-display-xs font-semibold text-primary">Dashboard</h1>
                    <Button size="lg" onPress={() => navigate(`/journal-post-editor/${crypto.randomUUID()}`)}>
                        Create Entry
                    </Button>
                </div>

                {entries && entries.length > 0 && (
                    <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {entries.map((entry) => (
                            <li key={entry.id}>
                                <JournalEntryCard entry={entry} />
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
};
