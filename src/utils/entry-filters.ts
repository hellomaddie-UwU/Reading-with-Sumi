import type { ComponentProps } from "react";
import { getLocalTimeZone } from "@internationalized/date";
import type { DateRangePicker } from "@/components/application/date-picker/date-range-picker";
import type { JournalEntry } from "@/utils/journal-storage";
import { getJournalEntryText } from "@/utils/journal-storage";
import { getTarotCard, tarotCards } from "@/utils/tarot-cards";

export type CardGroup = "any" | "major" | "wands" | "cups" | "swords" | "pentacles";
export type SavedCardFilter = "any" | "with" | "without";
export type DateRangeValue = NonNullable<ComponentProps<typeof DateRangePicker>["value"]>;

export interface EntryFilters {
    cardIds: Set<string>;
    cardGroup: CardGroup;
    dateRange: DateRangeValue | null;
    savedCard: SavedCardFilter;
}

export const emptyEntryFilters: EntryFilters = { cardIds: new Set(), cardGroup: "any", dateRange: null, savedCard: "any" };

export const cardGroupOptions: { id: CardGroup; label: string }[] = [
    { id: "any", label: "Any" },
    { id: "major", label: "Major Arcana" },
    { id: "wands", label: "Wands" },
    { id: "cups", label: "Cups" },
    { id: "swords", label: "Swords" },
    { id: "pentacles", label: "Pentacles" },
];

export const savedCardOptions: { id: SavedCardFilter; label: string }[] = [
    { id: "any", label: "Any" },
    { id: "with", label: "With a saved card" },
    { id: "without", label: "Without a saved card" },
];

export const getCardGroup = (cardId: string): CardGroup => {
    if (tarotCards.findIndex((card) => card.id === cardId) < 22) return "major";

    return (["wands", "cups", "swords", "pentacles"] as const).find((suit) => cardId.endsWith(`-of-${suit}`)) ?? "major";
};

export const countActiveFilters = (filters: EntryFilters) =>
    [filters.cardIds.size > 0, filters.cardGroup !== "any", filters.dateRange !== null, filters.savedCard !== "any"].filter(Boolean).length;

const matchesSearch = (entry: JournalEntry, search: string) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    const cardName = entry.writingPrompt ? (getTarotCard(entry.writingPrompt.cardId)?.name ?? "") : "";

    return [entry.title, getJournalEntryText(entry.content), cardName].some((text) => text.toLowerCase().includes(query));
};

const matchesFilters = (entry: JournalEntry, filters: EntryFilters) => {
    const cardId = entry.writingPrompt?.cardId;

    if (filters.cardIds.size > 0 && (!cardId || !filters.cardIds.has(cardId))) return false;
    if (filters.cardGroup !== "any" && (!cardId || getCardGroup(cardId) !== filters.cardGroup)) return false;
    if (filters.savedCard === "with" && !entry.writingPrompt?.isSaved) return false;
    if (filters.savedCard === "without" && entry.writingPrompt?.isSaved) return false;

    if (filters.dateRange) {
        const timeZone = getLocalTimeZone();
        const start = filters.dateRange.start.toDate(timeZone).getTime();
        const end = filters.dateRange.end.add({ days: 1 }).toDate(timeZone).getTime();
        const savedAt = entry.updatedAt ?? 0;

        if (savedAt < start || savedAt >= end) return false;
    }

    return true;
};

export const filterJournalEntries = (entries: JournalEntry[], search: string, filters: EntryFilters) =>
    entries.filter((entry) => matchesSearch(entry, search) && matchesFilters(entry, filters));
