import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link as AriaLink } from "react-aria-components";
import { TarotCardImage } from "@/components/journal/tarot-card-image";
import { cx } from "@/utils/cx";
import type { JournalEntry } from "@/utils/journal-storage";
import { getJournalEntryText } from "@/utils/journal-storage";
import { getTarotCard } from "@/utils/tarot-cards";

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

interface JournalEntryCardProps {
    entry: JournalEntry;
    /** When false, the card isn't a link to the editor (used in the Archive). */
    isLink?: boolean;
    /** A menu shown in the card's top-right corner. */
    menu?: ReactNode;
    /** Extra content under the text, such as Archive actions. */
    footer?: ReactNode;
}

export const JournalEntryCard = ({ entry, isLink = true, menu, footer }: JournalEntryCardProps) => {
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
        <article
            aria-label={title}
            className={cx(
                "relative flex h-full flex-col overflow-hidden rounded-xl bg-primary shadow-xs ring-1 ring-secondary ring-inset",
                isLink &&
                    "cursor-pointer outline-focus-ring transition duration-100 ease-linear hover:bg-primary_hover has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2",
            )}
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
                <div className="flex min-h-5 items-center justify-between gap-3">
                    {entry.updatedAt && <p className="text-sm text-tertiary">{dateFormatter.format(entry.updatedAt)}</p>}
                    {/* Sits above the card-wide link so its own clicks open the menu, not the entry. */}
                    {menu && <div className="relative z-10 -my-1.5 ml-auto rounded-md bg-primary p-1 shadow-xs ring-1 ring-secondary">{menu}</div>}
                </div>
                <h2 className="mt-1 truncate text-lg font-semibold text-primary">
                    {isLink ? (
                        // Stretches over the whole card so anywhere on it opens the entry.
                        <AriaLink href={`/journal-post-editor/${entry.id}`} className="outline-hidden after:absolute after:inset-0">
                            {title}
                        </AriaLink>
                    ) : (
                        title
                    )}
                </h2>
                {tarotCard && <p className="mt-1 text-sm font-semibold text-brand-secondary">{tarotCard.name}</p>}
                {preview && <p className="mt-1 line-clamp-2 text-sm text-tertiary">{preview}</p>}
                {footer && <div className="mt-auto pt-4">{footer}</div>}
            </div>
        </article>
    );
};
