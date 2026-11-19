import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
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

    const createEntryButton = (
        <Button size="lg" onPress={() => navigate(`/journal-post-editor/${crypto.randomUUID()}`)}>
            Create Entry
        </Button>
    );

    if (!entries) return <main className="min-h-dvh bg-primary" />;

    if (entries.length === 0) {
        return (
            <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-primary px-4 py-12">
                <h1 className="text-display-xs font-semibold text-primary">Dashboard</h1>
                {createEntryButton}
            </main>
        );
    }

    return (
        <main className="min-h-dvh bg-primary">
            <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-display-xs font-semibold text-primary">Dashboard</h1>
                    {createEntryButton}
                </div>

                <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {entries.map((entry) => (
                        <li key={entry.id}>
                            <JournalEntryCard entry={entry} />
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
};
