import { useEffect, useState } from "react";
import { Link as AriaLink } from "react-aria-components";
import { TarotCardImage } from "@/components/journal/tarot-card-image";
import type { JournalEntry } from "@/utils/journal-storage";
import { getJournalEntryText } from "@/utils/journal-storage";
import { getTarotCard } from "@/utils/tarot-cards";

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

export const JournalEntryCard = ({ entry }: { entry: JournalEntry }) => {
    const [imageUrl, setImageUrl] = useState<string>();

    useEffect(() => {
        if (!entry.featuredImage) return;

        const url = URL.createObjectURL(entry.featuredImage);
        setImageUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [entry.featuredImage]);

    const title = entry.title.trim() || "Untitled entry";
    const preview = getJournalEntryText(entry.content).trim();
    const tarotCard = entry.writingPrompt ? getTarotCard(entry.writingPrompt.cardId) : undefined;
    const savedCard = entry.writingPrompt?.isSaved ? tarotCard : undefined;

    return (
        <AriaLink
            href={`/journal-post-editor/${entry.id}`}
            aria-label={`Open ${title}`}
            className="flex h-full cursor-pointer flex-col overflow-hidden rounded-xl bg-primary shadow-xs ring-1 ring-secondary outline-focus-ring transition duration-100 ease-linear ring-inset hover:bg-primary_hover focus-visible:outline-2 focus-visible:outline-offset-2"
        >
            {imageUrl ? (
                <img src={imageUrl} alt="" className="aspect-video w-full object-cover" />
            ) : savedCard ? (
                <div className="relative aspect-video w-full overflow-hidden bg-secondary">
                    <TarotCardImage key={savedCard.id} card={savedCard} alt="" className="absolute inset-0 size-full object-contain p-2" />
                </div>
            ) : (
                <div className="aspect-video w-full bg-secondary" />
            )}

            <div className="flex flex-1 flex-col p-4">
                {entry.updatedAt && <p className="text-sm text-tertiary">{dateFormatter.format(entry.updatedAt)}</p>}
                <h2 className="mt-1 truncate text-lg font-semibold text-primary">{title}</h2>
                {tarotCard && <p className="mt-1 text-sm font-semibold text-brand-secondary">{tarotCard.name}</p>}
                {preview && <p className="mt-1 line-clamp-2 text-sm text-tertiary">{preview}</p>}
            </div>
        </AriaLink>
    );
};
