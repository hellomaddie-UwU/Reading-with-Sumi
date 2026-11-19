import type { JSONContent } from "@tiptap/core";

export type WritingPromptSource = "app" | "own-deck";

export interface JournalEntry {
    id: string;
    title: string;
    content?: JSONContent;
    featuredImage?: Blob;
    writingPrompt?: { cardId: string; source: WritingPromptSource; isSaved?: boolean };
    updatedAt?: number;
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

// Writes run in order, so a list loaded right after leaving the editor includes the latest save.
let latestWrite: Promise<void> = Promise.resolve();

export const saveJournalEntry = (entry: JournalEntry) => {
    const write = latestWrite.catch(() => undefined).then(() => writeJournalEntry(entry));
    latestWrite = write;
    return write;
};

/** The plain text of an entry, used for previews. */
export const getJournalEntryText = (content?: JSONContent): string => {
    if (!content) return "";
    if (content.text) return content.text;

    return (content.content ?? []).map(getJournalEntryText).filter(Boolean).join(" ");
};

const hasInsertedImage = (content?: JSONContent): boolean => content?.type === "image" || (content?.content ?? []).some(hasInsertedImage);

const hasSavedContent = (entry: JournalEntry) =>
    Boolean(entry.title.trim() || entry.featuredImage || entry.writingPrompt || getJournalEntryText(entry.content).trim() || hasInsertedImage(entry.content));

/** Every entry with something in it, most recently saved first. */
export const getJournalEntries = async () => {
    await latestWrite.catch(() => undefined);
    const database = await openDatabase();

    return new Promise<JournalEntry[]>((resolve, reject) => {
        const request = database.transaction(ENTRIES_STORE).objectStore(ENTRIES_STORE).getAll();

        request.onsuccess = () => {
            const entries = request.result as JournalEntry[];
            resolve(entries.filter(hasSavedContent).sort((first, second) => (second.updatedAt ?? 0) - (first.updatedAt ?? 0)));
        };
        request.onerror = () => reject(request.error);
    }).finally(() => database.close());
};

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
