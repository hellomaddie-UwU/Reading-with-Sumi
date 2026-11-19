export interface TarotCard {
    id: string;
    name: string;
    prompt: string;
}

const toCard = ([name, prompt]: [string, string]): TarotCard => ({
    id: name.toLowerCase().replace(/\s+/g, "-"),
    name,
    prompt,
});

export const tarotCards: TarotCard[] = (
    [
        // Major Arcana
        ["The Fool", "What would you begin today if you didn't need to know how it ends?"],
        ["The Magician", "Which skills or resources do you already have that you've been overlooking?"],
        ["The High Priestess", "What does your intuition keep telling you that you haven't said out loud?"],
        ["The Empress", "Where in your life are you being asked to nurture something, including yourself?"],
        ["The Emperor", "Where do you need firmer boundaries or more structure right now?"],
        ["The Hierophant", "Which belief or rule are you following because it's yours, and which because you inherited it?"],
        ["The Lovers", "What choice in front of you would bring your actions closer to your values?"],
        ["The Chariot", "What are you pushing toward, and what is pulling you in the opposite direction?"],
        ["Strength", "Where could gentleness do more for you right now than force?"],
        ["The Hermit", "What question do you need some quiet time alone to answer?"],
        ["Wheel of Fortune", "What has shifted recently that you didn't control? How are you responding to it?"],
        ["Justice", "What situation are you trying to see fairly? What would honesty ask of you?"],
        ["The Hanged Man", "What might look different if you stopped forcing it and changed your perspective?"],
        ["Death", "What part of your life has already ended, even if you haven't let it go yet?"],
        ["Temperance", "Where has your life fallen out of balance, and what small adjustment would help?"],
        ["The Devil", "What habit, fear or attachment has more power over you than you'd like?"],
        ["The Tower", "What has been shaken up recently, and what truth did it reveal?"],
        ["The Star", "What is giving you hope right now, however small it seems?"],
        ["The Moon", "What are you uncertain about, and which of those fears might not be real?"],
        ["The Sun", "What feels genuinely good in your life right now? Stay with it for a while."],
        ["Judgement", "What past version of yourself are you ready to forgive?"],
        ["The World", "What have you completed or outgrown that deserves more recognition?"],

        // Wands
        ["Ace of Wands", "What idea has sparked your excitement lately? What is one way to act on it?"],
        ["Two of Wands", "What are you weighing up about your future? What does staying put cost you?"],
        ["Three of Wands", "What have you set in motion that you're now waiting on? How does the waiting feel?"],
        ["Four of Wands", "Who or what makes you feel at home? When did you last celebrate that?"],
        ["Five of Wands", "Where are you caught in friction or competition? What is it really about?"],
        ["Six of Wands", "What recent win haven't you let yourself feel proud of?"],
        ["Seven of Wands", "What are you defending right now? Is it still worth defending?"],
        ["Eight of Wands", "What is moving quickly in your life? What do you want to catch before it passes?"],
        ["Nine of Wands", "What has worn you down, and what is keeping you going anyway?"],
        ["Ten of Wands", "What are you carrying that was never yours to carry alone?"],
        ["Page of Wands", "What are you curious about, even if you're a complete beginner?"],
        ["Knight of Wands", "Where are you rushing? What might you notice if you slowed down?"],
        ["Queen of Wands", "When do you feel most confident and most like yourself?"],
        ["King of Wands", "What vision for your life are you ready to take responsibility for?"],

        // Cups
        ["Ace of Cups", "What feeling is asking for more room in your life right now?"],
        ["Two of Cups", "Which relationship feels most mutual? What makes it feel that way?"],
        ["Three of Cups", "Who makes you feel celebrated? When did you last tell them?"],
        ["Four of Cups", "What are you feeling numb or bored about? What might you be missing?"],
        ["Five of Cups", "What loss are you still focused on? What is still standing beside it?"],
        ["Six of Cups", "Which memory keeps returning to you? What is it trying to give you?"],
        ["Seven of Cups", "Which options are distracting you from what you actually want?"],
        ["Eight of Cups", "What are you ready to walk away from, even though it isn't all bad?"],
        ["Nine of Cups", "What do you wish for right now? Would having it be as satisfying as you imagine?"],
        ["Ten of Cups", "What does emotional security look like for you, in everyday detail?"],
        ["Page of Cups", "What unexpected feeling or message has surprised you lately?"],
        ["Knight of Cups", "What are you romanticising? What would it look like in plain daylight?"],
        ["Queen of Cups", "How can you care for someone else's feelings without losing track of your own?"],
        ["King of Cups", "What strong emotion are you learning to hold steadily?"],

        // Swords
        ["Ace of Swords", "What truth has suddenly become clear? What does it ask you to do?"],
        ["Two of Swords", "What decision are you avoiding? What are you afraid will happen once you make it?"],
        ["Three of Swords", "What still hurts? Write about it without trying to fix it."],
        ["Four of Swords", "What would real rest look like for your mind this week?"],
        ["Five of Swords", "Which conflict did you win or lose at too high a cost?"],
        ["Six of Swords", "What difficult place are you slowly moving away from? What are you taking with you?"],
        ["Seven of Swords", "What are you keeping to yourself, and what is that protecting?"],
        ["Eight of Swords", "Where do you feel trapped? Which of those limits might be a story you've been told?"],
        ["Nine of Swords", "What thought keeps you up at night? Write it down exactly as it sounds."],
        ["Ten of Swords", "What feels like it has hit rock bottom? What could begin from here?"],
        ["Page of Swords", "What do you need to learn more about before you make up your mind?"],
        ["Knight of Swords", "Where have your words or decisions been moving faster than your thinking?"],
        ["Queen of Swords", "What needs to be said clearly and kindly? Who needs to hear it?"],
        ["King of Swords", "If you set your emotions aside for a moment, what do the facts tell you?"],

        // Pentacles
        ["Ace of Pentacles", "What practical opportunity is in front of you right now?"],
        ["Two of Pentacles", "What are you juggling? What would happen if one thing was allowed to drop?"],
        ["Three of Pentacles", "Who helps you do your best work? Where could you ask for more support?"],
        ["Four of Pentacles", "What are you holding on to tightly out of fear of losing it?"],
        ["Five of Pentacles", "Where do you feel left out in the cold? Who could you let in?"],
        ["Six of Pentacles", "Where is the balance of giving and receiving uneven in your life?"],
        ["Seven of Pentacles", "What have you been working on for a long time? Is it still worth your effort?"],
        ["Eight of Pentacles", "What are you getting better at through small, steady practice?"],
        ["Nine of Pentacles", "What have you built for yourself that you can enjoy on your own terms?"],
        ["Ten of Pentacles", "What do you want your everyday life to add up to in the long run?"],
        ["Page of Pentacles", "What new skill or goal deserves a small first step this week?"],
        ["Knight of Pentacles", "What routine is serving you well, and which one has become a rut?"],
        ["Queen of Pentacles", "How are you looking after your body, home and energy while caring for everything else?"],
        ["King of Pentacles", "What does feeling secure mean to you? How close are you to it?"],
    ] as [string, string][]
).map(toCard);

export const getTarotCard = (id: string) => tarotCards.find((card) => card.id === id);

/** Card artwork lives in `public/tarot-cards`, named after the card's id. */
export const getTarotCardImageUrl = (id: string) => `/tarot-cards/${id}.webp`;

const HIGH_PRIESTESS_PLACEHOLDER = "/tarot-cards/placeholder-card-2.png";
const MAGICIAN_PLACEHOLDER = "/tarot-cards/placeholder-card-3.png";

/** Stands in until a card has its own artwork. Each card always gets the same placeholder. */
export const getTarotCardPlaceholderUrl = (id: string) => {
    if (id === "the-high-priestess") return HIGH_PRIESTESS_PLACEHOLDER;
    if (id === "the-magician") return MAGICIAN_PLACEHOLDER;

    return tarotCards.findIndex((card) => card.id === id) % 2 === 0 ? HIGH_PRIESTESS_PLACEHOLDER : MAGICIAN_PLACEHOLDER;
};

export const getRandomTarotCard = (excludedId?: string) => {
    const cards = tarotCards.filter((card) => card.id !== excludedId);
    return cards[Math.floor(Math.random() * cards.length)];
};
