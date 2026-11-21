import { useEffect, useState } from "react";
import { RefreshCcw01, Trash01 } from "@untitledui/icons";
import { AppNavbar } from "@/components/application/app-navigation/app-navbar";
import { Button } from "@/components/base/buttons/button";
import { ConfirmDialog } from "@/components/journal/confirm-dialog";
import { JournalEntryCard } from "@/components/journal/journal-entry-card";
import type { JournalEntry } from "@/utils/journal-storage";
import {
    ARCHIVE_DAYS,
    deleteJournalEntryPermanently,
    emptyArchive,
    getArchiveDaysLeft,
    getArchivedEntries,
    restoreJournalEntry,
} from "@/utils/journal-storage";

type PendingAction = { type: "delete"; entry: JournalEntry } | { type: "empty" };

const formatDaysLeft = (deletedAt: number) => {
    const days = getArchiveDaysLeft(deletedAt);
    return days === 1 ? "1 day left" : `${days} days left`;
};

export const ArchiveScreen = () => {
    const [entries, setEntries] = useState<JournalEntry[] | null>(null);
    const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        let isCurrent = true;

        getArchivedEntries()
            .catch(() => [])
            .then((archived) => {
                if (isCurrent) setEntries(archived);
            });

        return () => {
            isCurrent = false;
        };
    }, []);

    const removeFromList = (id: string) => setEntries((current) => current?.filter((entry) => entry.id !== id) ?? null);

    const confirm = (action: PendingAction) => {
        setPendingAction(action);
        setIsConfirmOpen(true);
    };

    const runPendingAction = async () => {
        if (!pendingAction) return;

        if (pendingAction.type === "delete") {
            await deleteJournalEntryPermanently(pendingAction.entry.id);
            removeFromList(pendingAction.entry.id);
        } else {
            await emptyArchive();
            setEntries([]);
        }
    };

    const pendingTitle = pendingAction?.type === "delete" ? pendingAction.entry.title.trim() || "Untitled entry" : "";

    return (
        <div className="min-h-dvh bg-primary">
            <AppNavbar />

            <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-display-xs font-semibold text-primary">Archive</h1>
                        <p className="mt-1 text-md text-tertiary">Deleted entries are permanently removed after {ARCHIVE_DAYS} days.</p>
                    </div>
                    <Button
                        color="secondary-destructive"
                        size="lg"
                        iconLeading={Trash01}
                        isDisabled={!entries || entries.length === 0}
                        onPress={() => confirm({ type: "empty" })}
                    >
                        Empty archive
                    </Button>
                </div>

                {entries && entries.length === 0 && <p className="mt-16 text-center text-md text-tertiary">Your Archive is empty.</p>}

                {entries && entries.length > 0 && (
                    <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {entries.map((entry) => (
                            <li key={entry.id}>
                                <JournalEntryCard
                                    entry={entry}
                                    isLink={false}
                                    footer={
                                        <div className="flex flex-col gap-3">
                                            <p className="text-sm font-medium text-error-primary">{formatDaysLeft(entry.deletedAt ?? Date.now())}</p>
                                            <div className="flex flex-wrap gap-3 *:flex-1">
                                                <Button
                                                    color="secondary"
                                                    size="sm"
                                                    iconLeading={RefreshCcw01}
                                                    onPress={async () => {
                                                        await restoreJournalEntry(entry.id);
                                                        removeFromList(entry.id);
                                                    }}
                                                >
                                                    Restore
                                                </Button>
                                                <Button
                                                    color="secondary-destructive"
                                                    size="sm"
                                                    iconLeading={Trash01}
                                                    onPress={() => confirm({ type: "delete", entry })}
                                                >
                                                    Delete permanently
                                                </Button>
                                            </div>
                                        </div>
                                    }
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </main>

            <ConfirmDialog
                isPermanent
                isOpen={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                title={pendingAction?.type === "empty" ? "Empty the Archive?" : "Permanently delete this entry?"}
                description={
                    pendingAction?.type === "empty"
                        ? `This permanently deletes every entry in the Archive. This can't be undone.`
                        : `"${pendingTitle}" will be permanently deleted. This can't be undone.`
                }
                confirmLabel={pendingAction?.type === "empty" ? "Empty archive" : "Delete permanently"}
                onConfirm={runPendingAction}
            />
        </div>
    );
};
