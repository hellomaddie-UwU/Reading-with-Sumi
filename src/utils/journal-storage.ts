import type { JSONContent } from "@tiptap/core";

export type WritingPromptSource = "app" | "own-deck";

export interface JournalEntry {
    id: string;
    title: string;
    content?: JSONContent;
    featuredImage?: Blob;
    writingPrompt?: { cardId: string; source: WritingPromptSource; isSaved?: boolean };
    updatedAt?: number;
    /** When the entry was moved to the Archive. */
    deletedAt?: number;
}

export interface DeckPreference {
    hasDeck: boolean;
    deckName?: string;
}

const DATABASE_NAME = "reading-with-sumi";
const ENTRIES_STORE = "journal-entries";
const DECK_PREFERENCE_KEY = "reading-with-sumi:deck";

const openDatabase = () =>
    new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(DATABASE_NAME, 1);

        request.onupgradeneeded = () => request.result.createObjectStore(ENTRIES_STORE, { keyPath: "id" });
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });

export const getJournalEntry = async (id: string) => {
    const database = await openDatabase();

    return new Promise<JournalEntry | undefined>((resolve, reject) => {
        const request = database.transaction(ENTRIES_STORE).objectStore(ENTRIES_STORE).get(id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    }).finally(() => database.close());
};

const writeJournalEntry = async (entry: JournalEntry) => {
    const database = await openDatabase();

    return new Promise<void>((resolve, reject) => {
        const transaction = database.transaction(ENTRIES_STORE, "readwrite");

        transaction.objectStore(ENTRIES_STORE).put(entry);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
    }).finally(() => database.close());
};

const deleteJournalEntries = async (ids: string[]) => {
    if (ids.length === 0) return;
    const database = await openDatabase();

    return new Promise<void>((resolve, reject) => {
        const transaction = database.transaction(ENTRIES_STORE, "readwrite");

        ids.forEach((id) => transaction.objectStore(ENTRIES_STORE).delete(id));
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
    }).finally(() => database.close());
};

const readAllJournalEntries = async () => {
    const database = await openDatabase();

    return new Promise<JournalEntry[]>((resolve, reject) => {
        const request = database.transaction(ENTRIES_STORE).objectStore(ENTRIES_STORE).getAll();

        request.onsuccess = () => resolve(request.result as JournalEntry[]);
        request.onerror = () => reject(request.error);
    }).finally(() => database.close());
};

// Changes run in order, so a list loaded right after leaving the editor includes the latest save.
let latestWrite: Promise<unknown> = Promise.resolve();

const runInOrder = <T>(task: () => Promise<T>) => {
    const run = latestWrite.catch(() => undefined).then(task);
    latestWrite = run;
    return run;
};

export const saveJournalEntry = (entry: JournalEntry) => runInOrder(() => writeJournalEntry(entry));

/** The plain text of an entry, used for previews. */
export const getJournalEntryText = (content?: JSONContent): string => {
    if (!content) return "";
    if (content.text) return content.text;

    return (content.content ?? []).map(getJournalEntryText).filter(Boolean).join(" ");
};

const hasInsertedImage = (content?: JSONContent): boolean => content?.type === "image" || (content?.content ?? []).some(hasInsertedImage);

const hasSavedContent = (entry: JournalEntry) =>
    Boolean(entry.title.trim() || entry.featuredImage || entry.writingPrompt || getJournalEntryText(entry.content).trim() || hasInsertedImage(entry.content));

export const ARCHIVE_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Whole days left before an archived entry is permanently deleted. */
export const getArchiveDaysLeft = (deletedAt: number) => Math.max(0, Math.ceil((deletedAt + ARCHIVE_DAYS * DAY_MS - Date.now()) / DAY_MS));

/** Loads every entry after permanently removing archived ones older than 30 days. */
const loadEntriesAfterCleanup = () =>
    runInOrder(async () => {
        const entries = await readAllJournalEntries();
        const expired = entries.filter((entry) => entry.deletedAt !== undefined && getArchiveDaysLeft(entry.deletedAt) === 0);

        await deleteJournalEntries(expired.map((entry) => entry.id));
        return entries.filter((entry) => !expired.includes(entry));
    });

/** Every entry with something in it, most recently saved first. Archived entries are left out. */
export const getJournalEntries = async () => {
    const entries = await loadEntriesAfterCleanup();

    return entries
        .filter((entry) => entry.deletedAt === undefined && hasSavedContent(entry))
        .sort((first, second) => (second.updatedAt ?? 0) - (first.updatedAt ?? 0));
};

/** Archived entries, most recently deleted first. */
export const getArchivedEntries = async () => {
    const entries = await loadEntriesAfterCleanup();

    return entries.filter((entry) => entry.deletedAt !== undefined).sort((first, second) => (second.deletedAt ?? 0) - (first.deletedAt ?? 0));
};

const updateStoredEntry = (id: string, changes: Partial<JournalEntry>) =>
    runInOrder(async () => {
        const entry = await getJournalEntry(id);
        if (entry) await writeJournalEntry({ ...entry, ...changes });
    });

/** Moves an entry to the Archive, where it's kept for 30 days. */
export const archiveJournalEntry = (id: string) => updateStoredEntry(id, { deletedAt: Date.now() });

export const restoreJournalEntry = (id: string) => updateStoredEntry(id, { deletedAt: undefined });

export const deleteJournalEntryPermanently = (id: string) => runInOrder(() => deleteJournalEntries([id]));

export const emptyArchive = () =>
    runInOrder(async () => {
        const entries = await readAllJournalEntries();
        await deleteJournalEntries(entries.filter((entry) => entry.deletedAt !== undefined).map((entry) => entry.id));
    });

export const getDeckPreference = (): DeckPreference => {
    try {
        const saved = localStorage.getItem(DECK_PREFERENCE_KEY);
        return saved ? (JSON.parse(saved) as DeckPreference) : { hasDeck: false };
    } catch {
        return { hasDeck: false };
    }
};

export const saveDeckPreference = (preference: DeckPreference) => {
    try {
        localStorage.setItem(DECK_PREFERENCE_KEY, JSON.stringify(preference));
    } catch {
        // The app still works without a saved preference; it falls back to "Pull a Card".
    }
};
