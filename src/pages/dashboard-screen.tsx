import { useEffect, useState } from "react";
import { SearchLg, Trash01 } from "@untitledui/icons";
import { useNavigate } from "react-router";
import { AppNavbar } from "@/components/application/app-navigation/app-navbar";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Input } from "@/components/base/input/input";
import { ConfirmDialog } from "@/components/journal/confirm-dialog";
import { EntryFiltersButton } from "@/components/journal/entry-filters-button";
import { JournalEntryCard } from "@/components/journal/journal-entry-card";
import type { EntryFilters } from "@/utils/entry-filters";
import { emptyEntryFilters, filterJournalEntries } from "@/utils/entry-filters";
import type { JournalEntry } from "@/utils/journal-storage";
import { ARCHIVE_DAYS, archiveJournalEntry, getJournalEntries } from "@/utils/journal-storage";

export const DashboardScreen = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState<JournalEntry[] | null>(null);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState<EntryFilters>(emptyEntryFilters);
    const [entryToDelete, setEntryToDelete] = useState<JournalEntry | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

    const visibleEntries = entries ? filterJournalEntries(entries, search, filters) : [];

    const deleteEntry = async () => {
        if (!entryToDelete) return;

        await archiveJournalEntry(entryToDelete.id);
        setEntries((current) => current?.filter((entry) => entry.id !== entryToDelete.id) ?? null);
    };

    const clearSearchAndFilters = () => {
        setSearch("");
        setFilters(emptyEntryFilters);
    };

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
                    <>
                        <div className="mt-4 flex justify-end">
                            <div className="flex w-full items-start gap-3 sm:w-auto">
                                <Input
                                    aria-label="Search entries"
                                    icon={SearchLg}
                                    placeholder="Search entries"
                                    value={search}
                                    onChange={setSearch}
                                    className="sm:w-80"
                                />
                                <EntryFiltersButton filters={filters} onChange={setFilters} />
                            </div>
                        </div>

                        {visibleEntries.length > 0 ? (
                            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {visibleEntries.map((entry) => (
                                    <li key={entry.id}>
                                        <JournalEntryCard
                                            entry={entry}
                                            menu={
                                                <Dropdown.Root>
                                                    <Dropdown.DotsButton />
                                                    <Dropdown.Popover className="w-40">
                                                        <Dropdown.Menu
                                                            aria-label={`Actions for ${entry.title.trim() || "Untitled entry"}`}
                                                            onAction={() => {
                                                                setEntryToDelete(entry);
                                                                setIsDeleteDialogOpen(true);
                                                            }}
                                                        >
                                                            <Dropdown.Item id="delete" icon={Trash01}>
                                                                Delete
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown.Popover>
                                                </Dropdown.Root>
                                            }
                                        />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div role="status" className="mt-16 flex flex-col items-center gap-3 text-center">
                                <p className="text-md text-tertiary">No entries match your search or filters.</p>
                                <Button color="link-color" size="md" onPress={clearSearchAndFilters}>
                                    Clear search and filters
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </main>

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Delete this entry?"
                description={`"${entryToDelete?.title.trim() || "Untitled entry"}" will move to the Archive, where you can restore it for ${ARCHIVE_DAYS} days.`}
                confirmLabel="Delete"
                onConfirm={deleteEntry}
            />
        </div>
    );
};
