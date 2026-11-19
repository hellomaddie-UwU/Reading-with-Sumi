import { useState } from "react";
import type { TarotCard } from "@/utils/tarot-cards";
import { getTarotCardImageUrl, getTarotCardPlaceholderUrl } from "@/utils/tarot-cards";

interface TarotCardImageProps {
    card: TarotCard;
    alt?: string;
    className?: string;
}

/** Shows a card's own artwork, or a placeholder until that card has artwork. */
export const TarotCardImage = ({ card, alt = card.name, className }: TarotCardImageProps) => {
    const [source, setSource] = useState<"artwork" | "placeholder" | "none">("artwork");

    if (source === "none") return null;

    return (
        <img
            src={source === "artwork" ? getTarotCardImageUrl(card.id) : getTarotCardPlaceholderUrl(card.id)}
            alt={alt}
            onError={() => setSource((current) => (current === "artwork" ? "placeholder" : "none"))}
            className={className}
        />
    );
};
