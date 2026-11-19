import { useState } from "react";
import { ArrowLeft, SearchLg } from "@untitledui/icons";
import { Heading as AriaHeading } from "react-aria-components";
import { useNavigate } from "react-router";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Tabs } from "@/components/application/tabs/tabs";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Input } from "@/components/base/input/input";
import { TarotCardImage } from "@/components/journal/tarot-card-image";
import { tarotCardGuide } from "@/utils/tarot-card-guide";
import type { TarotCard } from "@/utils/tarot-cards";
import { tarotCards } from "@/utils/tarot-cards";

const cardGroups = [
    { id: "major", label: "Major Arcana", cards: tarotCards.slice(0, 22) },
    ...["Wands", "Cups", "Swords", "Pentacles"].map((suit) => ({
        id: suit.toLowerCase(),
        label: suit,
        cards: tarotCards.filter((card) => card.name.endsWith(`of ${suit}`)),
    })),
];

const CardGrid = ({ cards, onSelect }: { cards: TarotCard[]; onSelect: (card: TarotCard) => void }) => (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {cards.map((card) => (
            <li key={card.id}>
                <button
                    type="button"
                    onClick={() => onSelect(card)}
                    className="flex w-full cursor-pointer flex-col gap-2 rounded-lg text-left outline-focus-ring transition duration-100 ease-linear hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                    <TarotCardImage card={card} alt="" className="aspect-[2/3] w-full rounded-lg bg-secondary object-cover shadow-xs" />
                    <span className="text-sm font-medium text-secondary">{card.name}</span>
                </button>
            </li>
        ))}
    </ul>
);

const GuideSection = ({ title, children }: { title: string; children: string }) => (
    <section>
        <h3 className="text-sm font-semibold text-primary">{title}</h3>
        <p className="mt-1 text-md text-tertiary">{children}</p>
    </section>
);

export const LearningHubScreen = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
    const [isCardOpen, setIsCardOpen] = useState(false);

    const query = search.trim().toLowerCase();
    const searchResults = tarotCards.filter(
        (card) => card.name.toLowerCase().includes(query) || tarotCardGuide[card.id].keywords.some((keyword) => keyword.toLowerCase().includes(query)),
    );
    const guide = selectedCard ? tarotCardGuide[selectedCard.id] : undefined;

    const openCard = (card: TarotCard) => {
        setSelectedCard(card);
        setIsCardOpen(true);
    };

    const writeAboutCard = () => {
        if (!selectedCard) return;

        navigate(`/journal-post-editor/${crypto.randomUUID()}`, {
            state: { writingPrompt: { cardId: selectedCard.id, source: "app", isSaved: true } },
        });
    };

    return (
        <main className="min-h-dvh bg-primary">
            <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
                <Button href="/dashboard" color="link-gray" size="sm" iconLeading={ArrowLeft}>
                    Dashboard
                </Button>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-display-xs font-semibold text-primary">Learning Hub</h1>
                    <Input aria-label="Search cards" icon={SearchLg} placeholder="Search cards" value={search} onChange={setSearch} className="sm:max-w-xs" />
                </div>

                {query ? (
                    <div className="mt-8">
                        {searchResults.length > 0 ? (
                            <CardGrid cards={searchResults} onSelect={openCard} />
                        ) : (
                            <p role="status" className="py-12 text-center text-md text-tertiary">
                                No cards match "{search.trim()}".
                            </p>
                        )}
                    </div>
                ) : (
                    <Tabs className="mt-8">
                        <div className="scrollbar-hide overflow-x-auto">
                            <Tabs.List type="underline" size="md" aria-label="Card groups" className="w-max min-w-full">
                                {cardGroups.map((group) => (
                                    <Tabs.Item key={group.id} id={group.id}>
                                        {group.label}
                                    </Tabs.Item>
                                ))}
                            </Tabs.List>
                        </div>

                        {cardGroups.map((group) => (
                            <Tabs.Panel key={group.id} id={group.id} className="mt-8">
                                <CardGrid cards={group.cards} onSelect={openCard} />
                            </Tabs.Panel>
                        ))}
                    </Tabs>
                )}
            </div>

            <ModalOverlay isDismissable isOpen={isCardOpen} onOpenChange={setIsCardOpen}>
                <Modal className="sm:max-w-3xl">
                    <Dialog aria-label={selectedCard?.name}>
                        {selectedCard && guide && (
                            <div className="relative flex flex-col gap-6 p-6 sm:flex-row">
                                <CloseButton label="Close card" className="absolute top-3 right-3" />

                                <TarotCardImage
                                    key={selectedCard.id}
                                    card={selectedCard}
                                    className="aspect-[2/3] w-36 shrink-0 self-start rounded-lg object-cover shadow-xs sm:w-52"
                                />

                                <div className="flex min-w-0 flex-1 flex-col gap-4">
                                    <div className="pr-8">
                                        <AriaHeading slot="title" className="text-display-xs font-semibold text-primary">
                                            {selectedCard.name}
                                        </AriaHeading>
                                        <ul className="mt-2 flex flex-wrap gap-1.5">
                                            {guide.keywords.map((keyword) => (
                                                <li key={keyword}>
                                                    <Badge size="sm" color="brand" type="pill-color">
                                                        {keyword}
                                                    </Badge>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <GuideSection title="Meaning">{guide.meaning}</GuideSection>
                                    <GuideSection title="Reversed meaning">{guide.reversed}</GuideSection>
                                    <GuideSection title="Symbolism">{guide.symbolism}</GuideSection>
                                    <GuideSection title="Writing prompt">{selectedCard.prompt}</GuideSection>

                                    <Button size="lg" className="w-full sm:w-max" onPress={writeAboutCard}>
                                        Write about this card
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </main>
    );
};
