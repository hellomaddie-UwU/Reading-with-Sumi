import type { Mood } from "@/utils/cycles";
import { getEntryMood } from "@/utils/cycles";
import type { CardGroup } from "@/utils/entry-filters";
import { cardGroupOptions, getCardGroup } from "@/utils/entry-filters";
import type { JournalEntry } from "@/utils/journal-storage";
import { getTarotCard } from "@/utils/tarot-cards";

export type JourneyPeriod = "30-days" | "12-months" | "all-time";

export const journeyPeriods: { id: JourneyPeriod; label: string; bucketName: string }[] = [
    { id: "30-days", label: "30 days", bucketName: "week" },
    { id: "12-months", label: "12 months", bucketName: "month" },
    { id: "all-time", label: "All time", bucketName: "year" },
];

export type MoodCounts = Record<Mood, number>;

export interface JourneyBucket extends MoodCounts {
    label: string;
    /** Spelled-out label for tooltips and the table view. */
    fullLabel: string;
    entries: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

const emptyMoodCounts = (): MoodCounts => ({ joyful: 0, neutral: 0, low: 0, frustrated: 0, "needs-care": 0 });

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** Monday of the week the date falls in. */
const startOfWeek = (date: Date) => {
    const day = startOfDay(date);
    day.setDate(day.getDate() - ((day.getDay() + 6) % 7));
    return day;
};

const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const shortMonth = new Intl.DateTimeFormat("en-US", { month: "short" });
const longMonth = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

const getPeriodStart = (period: JourneyPeriod, entries: JournalEntry[], now: Date) => {
    if (period === "30-days") return startOfDay(new Date(now.getTime() - 29 * DAY_MS));
    if (period === "12-months") return new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const earliest = Math.min(...entries.map((entry) => entry.updatedAt ?? now.getTime()), now.getTime());
    return new Date(new Date(earliest).getFullYear(), 0, 1);
};

/** Buckets covering the period: weeks for 30 days, months for 12 months, years for all time. */
const createBuckets = (period: JourneyPeriod, periodStart: Date, now: Date) => {
    const buckets: { start: number; end: number; label: string; fullLabel: string }[] = [];

    if (period === "30-days") {
        for (let start = startOfWeek(periodStart); start <= now; start = new Date(start.getTime() + 7 * DAY_MS)) {
            buckets.push({
                start: start.getTime(),
                end: start.getTime() + 7 * DAY_MS,
                label: shortDate.format(start),
                fullLabel: `Week of ${shortDate.format(start)}`,
            });
        }
    } else if (period === "12-months") {
        for (let offset = 0; offset < 12; offset += 1) {
            const start = new Date(periodStart.getFullYear(), periodStart.getMonth() + offset, 1);
            const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
            buckets.push({ start: start.getTime(), end: end.getTime(), label: shortMonth.format(start), fullLabel: longMonth.format(start) });
        }
    } else {
        for (let year = periodStart.getFullYear(); year <= now.getFullYear(); year += 1) {
            buckets.push({ start: new Date(year, 0, 1).getTime(), end: new Date(year + 1, 0, 1).getTime(), label: String(year), fullLabel: String(year) });
        }
    }

    return buckets;
};

export interface JourneySummary {
    entryCount: number;
    moodCounts: MoodCounts;
    /** Entries with writing that Cycles could read. */
    readEntryCount: number;
    buckets: JourneyBucket[];
    topCards: { name: string; count: number }[];
    cardGroups: { id: CardGroup; label: string; count: number }[];
    cardCount: number;
}

export const summarizeJourney = (allEntries: JournalEntry[], period: JourneyPeriod, now = new Date()): JourneySummary => {
    const periodStart = getPeriodStart(period, allEntries, now);
    const entries = allEntries.filter((entry) => (entry.updatedAt ?? 0) >= periodStart.getTime());

    const ranges = createBuckets(period, periodStart, now);
    const buckets: JourneyBucket[] = ranges.map((range) => ({ label: range.label, fullLabel: range.fullLabel, entries: 0, ...emptyMoodCounts() }));

    const moodCounts = emptyMoodCounts();
    let readEntryCount = 0;
    const cardTally = new Map<string, number>();
    const groupTally = new Map<CardGroup, number>();

    entries.forEach((entry) => {
        const savedAt = entry.updatedAt ?? 0;
        const bucket = buckets[ranges.findIndex((range) => savedAt >= range.start && savedAt < range.end)];
        const mood = getEntryMood(entry);

        if (bucket) bucket.entries += 1;
        if (mood) {
            readEntryCount += 1;
            moodCounts[mood] += 1;
            if (bucket) bucket[mood] += 1;
        }

        const cardId = entry.writingPrompt?.cardId;
        if (cardId && getTarotCard(cardId)) {
            cardTally.set(cardId, (cardTally.get(cardId) ?? 0) + 1);
            const group = getCardGroup(cardId);
            groupTally.set(group, (groupTally.get(group) ?? 0) + 1);
        }
    });

    const topCards = [...cardTally.entries()]
        .map(([cardId, count]) => ({ name: getTarotCard(cardId)?.name ?? cardId, count }))
        .sort((first, second) => second.count - first.count || first.name.localeCompare(second.name))
        .slice(0, 5);

    return {
        entryCount: entries.length,
        moodCounts,
        readEntryCount,
        buckets,
        topCards,
        cardGroups: cardGroupOptions
            .filter((option) => option.id !== "any")
            .map((option) => ({ id: option.id, label: option.label, count: groupTally.get(option.id) ?? 0 })),
        cardCount: [...cardTally.values()].reduce((sum, count) => sum + count, 0),
    };
};
