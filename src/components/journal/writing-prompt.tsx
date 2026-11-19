import { useId, useState } from "react";
import { AlertTriangle, Check } from "@untitledui/icons";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { Select } from "@/components/base/select/select";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { TarotCardImage } from "@/components/journal/tarot-card-image";
import type { JournalEntry } from "@/utils/journal-storage";
import { getDeckPreference } from "@/utils/journal-storage";
import { getRandomTarotCard, getTarotCard, tarotCards } from "@/utils/tarot-cards";

const cardOptions = tarotCards.map((card) => ({ id: card.id, label: card.name }));

interface WritingPromptProps {
    value: JournalEntry["writingPrompt"];
    onChange: (value: JournalEntry["writingPrompt"]) => void;
    /** Called when the person confirms removing the saved card and everything written for it. */
    onReset: () => void;
}

export const WritingPrompt = ({ value, onChange, onReset }: WritingPromptProps) => {
    const [deck] = useState(getDeckPreference);
    const [isChoosingCard, setIsChoosingCard] = useState(false);
    const [cardSearch, setCardSearch] = useState("");
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
    const [cardNameToReset, setCardNameToReset] = useState("");
    const resetTitleId = useId();
    const resetDescriptionId = useId();

    const card = value ? getTarotCard(value.cardId) : undefined;
    const isSaved = Boolean(value?.isSaved);
    const matchingCards = cardOptions.filter((option) => option.label.toLowerCase().includes(cardSearch.trim().toLowerCase()));

    const pullCard = () => {
        setIsChoosingCard(false);
        onChange({ cardId: getRandomTarotCard(value?.cardId).id, source: "app" });
    };

    const savePrompt = () => {
        if (!value) return;

        setIsChoosingCard(false);
        onChange({ ...value, isSaved: true });
    };

    const resetPrompt = () => {
        setIsResetDialogOpen(false);
        onReset();
    };

    return (
        <section aria-labelledby="writing-prompt-heading" className="flex flex-col gap-3">
            <h2 id="writing-prompt-heading" className="text-sm font-medium text-secondary">
                Writing Prompt
            </h2>

            <div className="flex flex-wrap gap-3">
                <Button color="secondary" size="md" isDisabled={isSaved} onPress={pullCard}>
                    {deck.hasDeck ? "Pull from Us" : "Pull a Card"}
                </Button>
                {deck.hasDeck && (
                    <Button color="secondary" size="md" isDisabled={isSaved} onPress={() => setIsChoosingCard((isChoosing) => !isChoosing)}>
                        What did {deck.deckName || "your cards"} say?
                    </Button>
                )}
            </div>

            {isChoosingCard && (
                <Select.ComboBox
                    aria-label="Choose the card you pulled"
                    placeholder="Search for the card you pulled"
                    items={matchingCards}
                    inputValue={cardSearch}
                    onInputChange={setCardSearch}
                    onSelectionChange={(key) => {
                        if (key === null) return;
                        onChange({ cardId: String(key), source: "own-deck" });
                        setCardSearch("");
                        setIsChoosingCard(false);
                    }}
                >
                    {(item) => <Select.Item id={item.id} label={item.label} />}
                </Select.ComboBox>
            )}

            <div aria-live="polite">
                {card && (
                    <div className="flex flex-col items-start gap-4 rounded-xl bg-secondary p-4 sm:flex-row sm:items-center">
                        <TarotCardImage key={card.id} card={card} className="aspect-[2/3] w-28 shrink-0 rounded-lg object-cover shadow-xs" />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-brand-secondary">{card.name}</p>
                            <p className="mt-1 text-lg text-primary">{card.prompt}</p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                            <Button size="md" iconLeading={isSaved ? Check : undefined} isDisabled={isSaved} onPress={savePrompt}>
                                {isSaved ? "Saved" : "Save"}
                            </Button>
                            {isSaved && (
                                <Button
                                    color="secondary"
                                    size="md"
                                    onPress={() => {
                                        setCardNameToReset(card.name);
                                        setIsResetDialogOpen(true);
                                    }}
                                >
                                    Reset
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <ModalOverlay isDismissable isOpen={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                <Modal className="sm:max-w-md">
                    <Dialog role="alertdialog" aria-labelledby={resetTitleId} aria-describedby={resetDescriptionId}>
                        <div className="p-6">
                            <FeaturedIcon icon={AlertTriangle} color="warning" theme="light" size="lg" />
                            <h2 id={resetTitleId} className="mt-4 text-lg font-semibold text-primary">
                                Reset this card?
                            </h2>
                            <p id={resetDescriptionId} className="mt-1 text-sm text-tertiary">
                                This removes {cardNameToReset}, its writing prompt and everything you've written in this entry. This can't be undone.
                            </p>
                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <Button color="secondary" size="lg" onPress={() => setIsResetDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button color="primary-destructive" size="lg" onPress={resetPrompt}>
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </section>
    );
};
