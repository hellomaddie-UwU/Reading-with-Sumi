import type { JournalEntry } from "@/utils/journal-storage";
import { getJournalEntryText } from "@/utils/journal-storage";

/**
 * Cycles estimates the mood of each entry from the words in it.
 *
 * This is a word-list approach that runs entirely in the browser, so writing never leaves the device.
 * It's a stand-in until an AI model can run safely behind a backend, and it can get things wrong.
 */

export type Mood = "joyful" | "neutral" | "low" | "frustrated" | "needs-care";

export const moods: { id: Mood; label: string; colorVar: string }[] = [
    { id: "joyful", label: "Joyful", colorVar: "var(--mood-joyful)" },
    { id: "neutral", label: "Neutral", colorVar: "var(--mood-neutral)" },
    { id: "low", label: "Low", colorVar: "var(--mood-low)" },
    { id: "frustrated", label: "Frustrated", colorVar: "var(--mood-frustrated)" },
    { id: "needs-care", label: "Needs care", colorVar: "var(--mood-needs-care)" },
];

// Phrases that suggest someone may be unsafe. Any match puts the entry in "Needs care".
const needsCarePatterns = [
    /\bkill(ing)? my ?self\b/,
    /\bsuicid/,
    /\bself[- ]?harm/,
    /\bhurt(ing)? my ?self\b/,
    /\bcut(ting)? my ?self\b/,
    /\b(want|wanted|wanting) to die\b/,
    /\bend (my|it all|my life)\b/,
    /\bdon'?t want to (live|be here|exist)\b/,
    /\bno reason to (live|go on)\b/,
    /\bbetter off without me\b/,
    /\b(not|don'?t feel) safe\b/,
    /\b(being|was|been|getting) (abused|hit|threatened)\b/,
];

const joyfulWords = new Set([
    "happy",
    "happier",
    "joy",
    "joyful",
    "grateful",
    "thankful",
    "excited",
    "love",
    "loved",
    "loving",
    "calm",
    "peaceful",
    "proud",
    "hopeful",
    "glad",
    "content",
    "relieved",
    "wonderful",
    "amazing",
    "blessed",
    "good",
    "great",
    "fun",
    "laughed",
    "laughing",
    "smile",
    "smiled",
    "celebrate",
    "celebrated",
    "inspired",
    "confident",
    "free",
    "lighter",
    "beautiful",
    "enjoyed",
    "delighted",
]);

const lowWords = new Set([
    "sad",
    "sadness",
    "lonely",
    "alone",
    "tired",
    "exhausted",
    "empty",
    "hopeless",
    "cry",
    "cried",
    "crying",
    "tears",
    "down",
    "depressed",
    "grief",
    "grieving",
    "miss",
    "missing",
    "lost",
    "hurt",
    "heartbroken",
    "anxious",
    "anxiety",
    "worried",
    "worry",
    "afraid",
    "scared",
    "numb",
    "unhappy",
    "disappointed",
    "regret",
    "ashamed",
    "guilty",
    "worthless",
    "drained",
]);

const frustratedWords = new Set([
    "angry",
    "anger",
    "annoyed",
    "frustrated",
    "frustrating",
    "furious",
    "mad",
    "irritated",
    "stressed",
    "stress",
    "overwhelmed",
    "unfair",
    "hate",
    "hated",
    "rage",
    "resent",
    "resentful",
    "fed",
    "bitter",
    "argued",
    "argument",
    "fight",
    "fought",
    "ugh",
]);

const negations = new Set(["not", "never", "no", "don't", "dont", "isn't", "isnt", "wasn't", "wasnt", "didn't", "didnt", "can't", "cant"]);

const getEntryWriting = (entry: JournalEntry) => `${entry.title} ${getJournalEntryText(entry.content)}`.toLowerCase().replace(/[’]/g, "'");

/** The estimated mood of an entry, or null when there's no writing to read. */
export const getEntryMood = (entry: JournalEntry): Mood | null => {
    const writing = getEntryWriting(entry);
    const words = writing.match(/[a-z']+/g) ?? [];
    if (words.length === 0) return null;

    if (needsCarePatterns.some((pattern) => pattern.test(writing))) return "needs-care";

    let joyful = 0;
    let low = 0;
    let frustrated = 0;

    words.forEach((word, index) => {
        const isNegated = words.slice(Math.max(0, index - 3), index).some((previous) => negations.has(previous));

        if (joyfulWords.has(word)) {
            // "not happy" reads as low, not joyful.
            if (isNegated) low += 1;
            else joyful += 1;
        } else if (!isNegated && lowWords.has(word)) {
            low += 1;
        } else if (!isNegated && frustratedWords.has(word)) {
            frustrated += 1;
        }
    });

    const difficult = low + frustrated;

    if (joyful === 0 && difficult === 0) return "neutral";
    if (joyful > difficult) return "joyful";
    if (difficult > joyful) return frustrated > low ? "frustrated" : "low";
    return "neutral";
};
