export interface TarotCardGuide {
    keywords: string[];
    meaning: string;
    reversed: string;
    symbolism: string;
}

export const tarotCardGuide: Record<string, TarotCardGuide> = {
    // Major Arcana
    "the-fool": {
        keywords: ["New beginnings", "Trust", "Openness"],
        meaning: "A fresh start is calling. The Fool invites you to step forward with curiosity, even when you can't see the whole path.",
        reversed: "You may be rushing without thinking it through, or holding back because the first step feels too risky.",
        symbolism: "The cliff edge marks the leap into the unknown. The small bundle suggests travelling light, and the white rose stands for innocence.",
    },
    "the-magician": {
        keywords: ["Skill", "Focus", "Resourcefulness"],
        meaning: "You already have what you need. The Magician asks you to focus your talents and turn an idea into action.",
        reversed: "Your energy may be scattered, or your abilities are going unused. Check whether you're being fully honest with yourself.",
        symbolism:
            "The cup, sword, wand and pentacle on the table represent the four elements. One raised hand and one lowered hand link ideas to the real world.",
    },
    "the-high-priestess": {
        keywords: ["Intuition", "Stillness", "Inner knowing"],
        meaning: "The answer may be quieter than you expect. Slow down and listen to what you already sense beneath the surface.",
        reversed: "You may be ignoring your instincts or letting other people's opinions drown out your own.",
        symbolism:
            "The black and white pillars represent opposites held in balance. The veil hides deeper knowledge, and the crescent moon points to intuition.",
    },
    "the-empress": {
        keywords: ["Nurture", "Abundance", "Creativity"],
        meaning: "Something is ready to grow. The Empress encourages care, pleasure and patience with yourself and what you're creating.",
        reversed: "You may be giving too much to others, neglecting your own needs, or feeling creatively blocked.",
        symbolism: "Ripening wheat stands for abundance and the flowing river for life moving forward. Her crown of stars connects her to the natural cycles.",
    },
    "the-emperor": {
        keywords: ["Structure", "Authority", "Stability"],
        meaning: "Clear boundaries and steady leadership are needed. The Emperor asks you to take responsibility and build something solid.",
        reversed: "Control may have become rigid, or a lack of discipline is leaving you without firm ground.",
        symbolism: "The stone throne shows permanence and the rams' heads suggest drive and determination. The bare mountains reflect discipline.",
    },
    "the-hierophant": {
        keywords: ["Tradition", "Belief", "Guidance"],
        meaning: "Established wisdom has something to teach you. Consider which teachers, values or traditions truly support you.",
        reversed: "It may be time to question inherited rules and find a path that belongs to you.",
        symbolism:
            "The crossed keys represent access to hidden knowledge. The raised hand offers a blessing, and the two followers show teaching being passed on.",
    },
    "the-lovers": {
        keywords: ["Choice", "Connection", "Values"],
        meaning: "A meaningful relationship or decision asks you to act from your values. Honest connection begins with honesty with yourself.",
        reversed: "You may feel out of alignment with someone, or be avoiding responsibility for a choice.",
        symbolism: "The angel above offers guidance. The two trees represent knowledge and passion, and the open landscape reflects vulnerability.",
    },
    "the-chariot": {
        keywords: ["Determination", "Direction", "Willpower"],
        meaning: "Progress comes from focus. The Chariot asks you to bring competing parts of yourself together and move forward.",
        reversed: "You may be pulled in different directions, pushing too hard, or unsure where you're actually heading.",
        symbolism: "The black and white sphinxes represent opposing forces. The driver holds no reins, steering through will alone.",
    },
    strength: {
        keywords: ["Courage", "Compassion", "Patience"],
        meaning: "True strength is gentle. This card asks you to meet fear or frustration with calm persistence rather than force.",
        reversed: "Self-doubt may be louder than usual, or you could be being too hard on yourself.",
        symbolism: "A figure calmly closes a lion's jaws, showing mastery through kindness. The infinity sign above suggests endless inner resources.",
    },
    "the-hermit": {
        keywords: ["Solitude", "Reflection", "Inner guidance"],
        meaning: "Step back from the noise. Time alone can show you what you need to understand next.",
        reversed: "Solitude may have turned into isolation, or you may be avoiding the reflection you need.",
        symbolism: "The lantern holds a star of wisdom that lights only the next step. The snowy peak reflects a hard-won perspective.",
    },
    "wheel-of-fortune": {
        keywords: ["Change", "Cycles", "Turning points"],
        meaning: "Life is shifting. The Wheel reminds you that seasons change, and asks how you want to respond to what you can't control.",
        reversed: "You may feel stuck in a repeating pattern or resistant to a change that's already underway.",
        symbolism: "The turning wheel shows constant change. The four winged figures in the corners represent stability in the middle of movement.",
    },
    justice: {
        keywords: ["Fairness", "Truth", "Accountability"],
        meaning: "Honest assessment is needed. Justice asks you to weigh the facts and take responsibility for your part.",
        reversed: "Something may feel unfair, or you could be avoiding an uncomfortable truth about your own role.",
        symbolism: "The scales weigh evidence and the upright sword represents clear thinking. The pillars frame a place of impartial judgment.",
    },
    "the-hanged-man": {
        keywords: ["Pause", "Surrender", "New perspective"],
        meaning: "Forcing it won't help right now. Letting go and looking from another angle may reveal what you've been missing.",
        reversed: "You may be stalling, resisting a needed pause, or making sacrifices that no longer serve you.",
        symbolism: "The figure hangs by choice with a calm face. The glow around the head suggests insight that arrives through stillness.",
    },
    death: {
        keywords: ["Endings", "Transformation", "Release"],
        meaning: "Something has run its course. This card rarely means a literal death. It marks an ending that makes room for change.",
        reversed: "You may be clinging to what's already over, or fearing the change that would help you move on.",
        symbolism: "The rising sun between two towers promises renewal. The white rose on the banner stands for purity and new life.",
    },
    temperance: {
        keywords: ["Balance", "Moderation", "Healing"],
        meaning: "Small adjustments matter. Temperance invites patience as you blend different parts of your life into a better balance.",
        reversed: "Something may be out of proportion, and excess or impatience could be wearing you down.",
        symbolism: "Water flows between two cups, showing careful blending. One foot on land and one in water bridges practical life and emotion.",
    },
    "the-devil": {
        keywords: ["Attachment", "Habit", "Shadow"],
        meaning: "Notice what has a hold on you. The Devil brings unhealthy patterns and fears into the open so you can face them.",
        reversed: "You may be starting to break free, or finally admitting what has been keeping you stuck.",
        symbolism: "The chains around the two figures are loose, suggesting they could step free. The inverted pentagram shows priorities turned upside down.",
    },
    "the-tower": {
        keywords: ["Upheaval", "Revelation", "Breakthrough"],
        meaning: "A sudden shake-up exposes what was unstable. It can be painful, but it clears the way for something more honest.",
        reversed: "You may be avoiding a necessary collapse, or quietly recovering from one.",
        symbolism: "Lightning strikes the tower as a flash of truth. The falling crown shows false certainty being knocked away.",
    },
    "the-star": {
        keywords: ["Hope", "Renewal", "Calm"],
        meaning: "After difficulty comes quiet hope. The Star invites you to rest, heal and trust that better days are possible.",
        reversed: "You may feel disconnected from hope, or need to rebuild faith in yourself one small step at a time.",
        symbolism: "Water poured on land and pool shows renewal being shared. The large star surrounded by seven smaller stars offers guidance in the dark.",
    },
    "the-moon": {
        keywords: ["Uncertainty", "Dreams", "Illusion"],
        meaning: "Not everything is clear yet. The Moon asks you to move carefully through confusion and pay attention to your fears and dreams.",
        reversed: "Confusion may be lifting, or hidden anxieties are finally coming to the surface.",
        symbolism:
            "The dog and wolf represent tame and wild instincts. The winding path leads through the unknown, and the crayfish shows what emerges from the depths.",
    },
    "the-sun": {
        keywords: ["Joy", "Clarity", "Vitality"],
        meaning: "Warmth and clarity are here. The Sun encourages you to enjoy what is going well and let yourself be seen.",
        reversed: "Your joy may feel dimmed for now, or you may be struggling to believe that good things can last.",
        symbolism: "The child represents innocence and freedom. Sunflowers turn toward the light, and the wall behind suggests obstacles left behind.",
    },
    judgement: {
        keywords: ["Awakening", "Forgiveness", "Calling"],
        meaning: "It's time to look honestly at your past and answer what's calling you next. Forgiveness makes that possible.",
        reversed: "Self-criticism or regret may be keeping you from moving forward.",
        symbolism: "An angel's trumpet calls people to rise, signalling a wake-up call. The open coffins show old versions of the self being left behind.",
    },
    "the-world": {
        keywords: ["Completion", "Wholeness", "Achievement"],
        meaning: "A chapter has come full circle. Take time to recognise how far you've come before beginning again.",
        reversed: "Something may feel unfinished, or you may be hesitant to close one chapter and start the next.",
        symbolism: "The laurel wreath represents success and the dancing figure shows freedom. The four corner figures bring all the elements together.",
    },

    // Wands
    "ace-of-wands": {
        keywords: ["Inspiration", "Potential", "Spark"],
        meaning: "A new idea or burst of energy is here. Act on it while the spark is alive.",
        reversed: "Motivation may be low, or a promising idea is being delayed by doubt.",
        symbolism: "A hand offers a sprouting wand from a cloud, showing creative potential being handed to you. The leaves suggest growth.",
    },
    "two-of-wands": {
        keywords: ["Planning", "Decisions", "Vision"],
        meaning: "You're looking beyond where you are now. Weigh your options and decide what you're willing to pursue.",
        reversed: "Fear of the unknown may be keeping you in your comfort zone, or your plans lack direction.",
        symbolism: "The figure holds a globe while looking out from a castle, weighing safety against a much larger world.",
    },
    "three-of-wands": {
        keywords: ["Expansion", "Foresight", "Progress"],
        meaning: "Your efforts are beginning to move. Keep your eyes on the horizon as your plans take shape.",
        reversed: "Delays or limited thinking may be frustrating you. Review what's realistically in reach.",
        symbolism: "The figure watches ships at sea, waiting for ventures already set in motion to return.",
    },
    "four-of-wands": {
        keywords: ["Celebration", "Home", "Belonging"],
        meaning: "Pause and appreciate a milestone. This card honours the people and places that make you feel at home.",
        reversed: "There may be tension at home, or you may be skipping the celebration your progress deserves.",
        symbolism: "Four wands form a garlanded canopy, a welcoming structure. The figures beyond raise their arms in celebration.",
    },
    "five-of-wands": {
        keywords: ["Conflict", "Competition", "Tension"],
        meaning: "Different opinions are clashing. Ask whether this friction is useful or simply draining your energy.",
        reversed: "You may be avoiding conflict, or an argument is finally beginning to settle.",
        symbolism: "Five figures swing their wands with no clear winner, showing disorder more than real danger.",
    },
    "six-of-wands": {
        keywords: ["Victory", "Recognition", "Confidence"],
        meaning: "You've earned this moment. Let yourself feel proud and accept the recognition that comes with it.",
        reversed: "You may be craving outside approval, or struggling to believe in your own success.",
        symbolism: "A rider wearing a laurel wreath moves through a crowd, a public sign of achievement and support.",
    },
    "seven-of-wands": {
        keywords: ["Defence", "Perseverance", "Conviction"],
        meaning: "Stand your ground on what matters. You may be challenged, but your position is stronger than it feels.",
        reversed: "You may feel overwhelmed, or be defending something that no longer needs protecting.",
        symbolism: "From higher ground, one figure holds off six wands below, showing an advantage despite the pressure.",
    },
    "eight-of-wands": {
        keywords: ["Speed", "Movement", "Momentum"],
        meaning: "Things are moving quickly. Stay focused and be ready to act as news and opportunities arrive.",
        reversed: "Delays or poor timing may be causing frustration, or you could be moving too fast.",
        symbolism: "Eight wands fly through open air with nothing in their way, showing energy heading toward its target.",
    },
    "nine-of-wands": {
        keywords: ["Resilience", "Persistence", "Weariness"],
        meaning: "You're tired, but close. Draw on what you've learned and protect your energy for the last stretch.",
        reversed: "Exhaustion or defensiveness may be taking over. Consider what support you could accept.",
        symbolism: "A bandaged figure leans on a wand, guarding the others. The wound shows past battles and the stance shows readiness.",
    },
    "ten-of-wands": {
        keywords: ["Burden", "Responsibility", "Overload"],
        meaning: "You're carrying too much. Look at what can be shared, delayed or set down.",
        reversed: "You may be refusing to let go of duties, or are finally beginning to release them.",
        symbolism: "A figure hunches under ten wands and can barely see ahead, showing how burdens narrow your view.",
    },
    "page-of-wands": {
        keywords: ["Curiosity", "Enthusiasm", "Exploration"],
        meaning: "Follow what excites you. You don't need to be an expert to begin exploring something new.",
        reversed: "Your enthusiasm may fade quickly, or ideas could be lacking follow-through.",
        symbolism: "A young figure studies a sprouting wand with wonder. The desert around them suggests open territory to explore.",
    },
    "knight-of-wands": {
        keywords: ["Action", "Passion", "Adventure"],
        meaning: "Bold energy is pushing you forward. Use it, but make sure you know what you're charging toward.",
        reversed: "Impulsiveness or restlessness may be causing mistakes or leaving things unfinished.",
        symbolism: "A knight on a rearing horse shows eager movement. The flame-like plume reflects a passionate nature.",
    },
    "queen-of-wands": {
        keywords: ["Confidence", "Warmth", "Independence"],
        meaning: "Own your presence. This queen leads with warmth, courage and a clear sense of who she is.",
        reversed: "Insecurity or jealousy may be dimming your confidence. Return to what makes you feel like yourself.",
        symbolism: "Sunflowers represent joy and vitality. The black cat at her feet suggests intuition and comfort with her shadow side.",
    },
    "king-of-wands": {
        keywords: ["Vision", "Leadership", "Boldness"],
        meaning: "Take charge of the bigger picture. Lead with vision and inspire others through your own commitment.",
        reversed: "Impatience or high expectations may be making you controlling or hard to work with.",
        symbolism: "Salamanders on the throne represent fire and transformation. The living wand shows creative power under control.",
    },

    // Cups
    "ace-of-cups": {
        keywords: ["New feelings", "Love", "Openness"],
        meaning: "Your heart is opening. Make room for new feelings, compassion or a fresh emotional start.",
        reversed: "Emotions may feel blocked, or you could be giving to others while running on empty.",
        symbolism: "An overflowing cup held from a cloud shows emotion in abundance. The dove represents peace.",
    },
    "two-of-cups": {
        keywords: ["Partnership", "Mutual respect", "Connection"],
        meaning: "A balanced bond is forming. This card celebrates connection where both people give and receive.",
        reversed: "A relationship may feel uneven, or communication has started to break down.",
        symbolism: "Two people exchange cups as equals. The winged lion's head above represents passion guided by care.",
    },
    "three-of-cups": {
        keywords: ["Friendship", "Celebration", "Community"],
        meaning: "Enjoy the people who lift you up. Shared joy and support are worth making time for.",
        reversed: "You may feel left out, or social obligations could be draining you.",
        symbolism: "Three figures raise their cups in a circle. The harvest at their feet shows abundance that is shared.",
    },
    "four-of-cups": {
        keywords: ["Apathy", "Contemplation", "Missed offers"],
        meaning: "You may feel flat or uninterested. Look again, because something worthwhile may be right in front of you.",
        reversed: "Motivation may be returning, and you're becoming ready to re-engage with life.",
        symbolism: "A seated figure ignores a cup offered from a cloud, focused only on the three already in front of them.",
    },
    "five-of-cups": {
        keywords: ["Grief", "Regret", "Disappointment"],
        meaning: "Let yourself feel the loss. When you're ready, notice what still remains behind you.",
        reversed: "You may be starting to accept what happened and move forward from it.",
        symbolism: "A cloaked figure mourns three spilled cups while two upright cups wait behind them. The bridge offers a way forward.",
    },
    "six-of-cups": {
        keywords: ["Nostalgia", "Memory", "Innocence"],
        meaning: "The past is close to you now. A memory, old friend or childhood feeling may have something to offer.",
        reversed: "Living in the past may be keeping you from enjoying what's here today.",
        symbolism: "Children share cups filled with flowers in an old courtyard, showing simple kindness and treasured memories.",
    },
    "seven-of-cups": {
        keywords: ["Choices", "Fantasy", "Illusion"],
        meaning: "So many options can be overwhelming. Separate what you truly want from what only looks appealing.",
        reversed: "Clarity may be arriving, helping you commit to one realistic choice.",
        symbolism: "Seven cups float in clouds, each holding a different vision. The clouds show that not all of them are real.",
    },
    "eight-of-cups": {
        keywords: ["Walking away", "Searching", "Letting go"],
        meaning: "Something no longer fulfils you. Leaving can be hard, even when you know you need more.",
        reversed: "You may be afraid to leave, or unsure whether walking away is the right choice.",
        symbolism: "A figure walks toward the mountains, leaving neatly stacked cups behind. The moon lights a journey made by instinct.",
    },
    "nine-of-cups": {
        keywords: ["Contentment", "Wishes", "Gratitude"],
        meaning: "Take in what's going well. This card marks emotional satisfaction and wishes coming true.",
        reversed: "Getting what you wanted may not feel as fulfilling as you expected.",
        symbolism: "A content figure sits before nine cups arranged on display, a picture of comfort and pride.",
    },
    "ten-of-cups": {
        keywords: ["Harmony", "Family", "Fulfilment"],
        meaning: "Lasting happiness comes from love and belonging. Notice who makes your life feel complete.",
        reversed: "Family tension or unrealistic ideals of happiness may be weighing on you.",
        symbolism: "A rainbow of cups arches over a joyful family and their home, showing emotional peace and security.",
    },
    "page-of-cups": {
        keywords: ["Sensitivity", "Imagination", "Surprise"],
        meaning: "Stay open to unexpected feelings and ideas. A gentle, creative message may be reaching you.",
        reversed: "Emotional immaturity or creative blocks may be getting in the way.",
        symbolism: "A fish peeks from a cup and surprises the page, showing intuition appearing where you least expect it.",
    },
    "knight-of-cups": {
        keywords: ["Romance", "Idealism", "Following the heart"],
        meaning: "Follow what moves you. This knight brings charm, creativity and an invitation to lead with feeling.",
        reversed: "Moodiness or unrealistic expectations could be clouding your judgment.",
        symbolism: "A knight rides slowly, offering a cup. The winged helmet suggests imagination and a graceful message.",
    },
    "queen-of-cups": {
        keywords: ["Compassion", "Intuition", "Emotional depth"],
        meaning: "Trust your emotional wisdom. You can care deeply for others while staying connected to yourself.",
        reversed: "You may be absorbing others' feelings or losing track of your own boundaries.",
        symbolism: "She gazes into an ornate closed cup, showing deep inner reflection. Water at her feet represents emotion.",
    },
    "king-of-cups": {
        keywords: ["Emotional balance", "Calm", "Diplomacy"],
        meaning: "Stay steady through strong feelings. This king shows that compassion and composure can work together.",
        reversed: "Emotions may be suppressed, or moods could be influencing others more than you realise.",
        symbolism: "His throne rests on rough seas without being overturned, showing calm in the middle of emotion.",
    },

    // Swords
    "ace-of-swords": {
        keywords: ["Clarity", "Truth", "Breakthrough"],
        meaning: "A clear thought cuts through confusion. Use this moment of truth to decide what comes next.",
        reversed: "Confusion or harsh words may be clouding the issue. Slow down before you speak or decide.",
        symbolism: "An upright sword pierces a crown, showing the power of a clear mind. The mountains suggest the challenges ahead.",
    },
    "two-of-swords": {
        keywords: ["Indecision", "Stalemate", "Avoidance"],
        meaning: "You're avoiding a difficult choice. Take off the blindfold and look honestly at what's in front of you.",
        reversed: "Information may be coming to light, or the pressure to decide is growing.",
        symbolism: "A blindfolded figure balances two crossed swords, keeping emotions and decisions in a tense standstill.",
    },
    "three-of-swords": {
        keywords: ["Heartbreak", "Grief", "Painful truth"],
        meaning: "It hurts, and it's okay to say so. Naming your pain is part of how you begin to heal.",
        reversed: "You may be recovering from hurt, or holding on to pain you're ready to release.",
        symbolism: "Three swords pierce a heart under storm clouds, showing sorrow plainly and without disguise.",
    },
    "four-of-swords": {
        keywords: ["Rest", "Recovery", "Stillness"],
        meaning: "Your mind needs a break. Rest isn't giving up. It's how you recover enough to continue.",
        reversed: "Burnout may be near, or you may be restless and struggling to properly rest.",
        symbolism: "A figure lies peacefully in a quiet church. The stained glass suggests calm, and the sword below is set aside.",
    },
    "five-of-swords": {
        keywords: ["Conflict", "Hollow victory", "Pride"],
        meaning: "Ask what winning is really costing you. Some battles leave everyone feeling worse.",
        reversed: "You may be ready to make peace, apologise or let an old conflict go.",
        symbolism: "One figure gathers swords while the defeated walk away under a jagged sky, showing a win with a heavy cost.",
    },
    "six-of-swords": {
        keywords: ["Transition", "Moving on", "Healing"],
        meaning: "You're slowly leaving difficulty behind. The journey may be quiet, but calmer water is ahead.",
        reversed: "Unresolved issues may be following you, or you may be resisting the move you need to make.",
        symbolism: "A boat carries passengers from rough to smooth water. The swords travel with them, showing that memories come too.",
    },
    "seven-of-swords": {
        keywords: ["Strategy", "Secrecy", "Avoidance"],
        meaning: "Something isn't fully out in the open. Consider whether you're being clever or avoiding honesty.",
        reversed: "A secret may be surfacing, or you may be ready to come clean with yourself.",
        symbolism: "A figure sneaks away carrying swords while looking back, showing cunning and the fear of being caught.",
    },
    "eight-of-swords": {
        keywords: ["Restriction", "Limiting beliefs", "Feeling trapped"],
        meaning: "You may feel stuck, but the barriers aren't as solid as they seem. Question the story you've been telling yourself.",
        reversed: "You're beginning to see a way out and reclaim your sense of choice.",
        symbolism: "A bound and blindfolded figure stands among swords, yet the path ahead is open and the ties are loose.",
    },
    "nine-of-swords": {
        keywords: ["Anxiety", "Worry", "Sleepless nights"],
        meaning: "Worry is taking up too much room. Write down your fears, and notice which ones are facts.",
        reversed: "The worst of your anxiety may be easing, or it may be time to ask for support.",
        symbolism: "A figure sits up in bed with their head in their hands. Nine swords on the dark wall represent racing thoughts.",
    },
    "ten-of-swords": {
        keywords: ["Painful endings", "Rock bottom", "Release"],
        meaning: "A hard chapter has reached its end. It can't get lower from here, and that makes room for recovery.",
        reversed: "You may be slowly recovering, or refusing to let a painful ending truly be over.",
        symbolism: "A figure lies under ten swords as dawn breaks on the horizon, showing that darkness is giving way to light.",
    },
    "page-of-swords": {
        keywords: ["Curiosity", "Learning", "New ideas"],
        meaning: "Ask questions and stay alert. A curious mind will help you see the situation more clearly.",
        reversed: "Gossip, hasty words or scattered thinking may be creating problems.",
        symbolism: "A young figure holds a sword high on windy ground, alert to shifting ideas and information.",
    },
    "knight-of-swords": {
        keywords: ["Drive", "Ambition", "Haste"],
        meaning: "You're moving fast toward a goal. Keep your focus, and make sure your speed doesn't hurt anyone.",
        reversed: "Recklessness or harsh communication may be causing more harm than progress.",
        symbolism: "A knight charges into strong wind with sword raised, showing determination that doesn't stop to look around.",
    },
    "queen-of-swords": {
        keywords: ["Honesty", "Independence", "Clear boundaries"],
        meaning: "Speak plainly and kindly. Experience has given you the clarity to see things as they are.",
        reversed: "Coldness or bitterness may be affecting how you speak to yourself and others.",
        symbolism: "She sits above the clouds with an upright sword, while one extended hand shows openness to honest truth.",
    },
    "king-of-swords": {
        keywords: ["Logic", "Authority", "Integrity"],
        meaning: "Think clearly and act fairly. Use reason and experience to make a decision you can stand behind.",
        reversed: "Power or intellect may be used unfairly, or logic may be shutting out compassion.",
        symbolism: "He faces forward with an upright sword, showing direct judgment. Butterflies on the throne represent a changing mind.",
    },

    // Pentacles
    "ace-of-pentacles": {
        keywords: ["Opportunity", "Prosperity", "New foundation"],
        meaning: "A practical opportunity is within reach. Plant the seed now and give it time to grow.",
        reversed: "A chance may be slipping away, or poor planning could be holding you back.",
        symbolism: "A hand offers a golden coin above a garden, with a gateway leading toward future growth.",
    },
    "two-of-pentacles": {
        keywords: ["Balance", "Adaptability", "Juggling"],
        meaning: "You're managing many priorities. Stay flexible and notice what needs your attention first.",
        reversed: "You may be overcommitted, and something could soon slip if you don't simplify.",
        symbolism: "A figure juggles two coins inside an infinity loop while ships ride the waves behind, showing life's ups and downs.",
    },
    "three-of-pentacles": {
        keywords: ["Teamwork", "Craft", "Collaboration"],
        meaning: "Good work grows with others. Share your skills and value what each person brings.",
        reversed: "Poor communication or a lack of shared direction may be slowing the work.",
        symbolism: "An artisan consults with two others inside a cathedral, showing skilled work and shared planning.",
    },
    "four-of-pentacles": {
        keywords: ["Security", "Control", "Holding on"],
        meaning: "Stability matters, but gripping too tightly can limit you. Ask what you're afraid to lose.",
        reversed: "You may be learning to loosen your grip, or spending without a clear plan.",
        symbolism: "A crowned figure clutches one coin, balances another on the head and pins two under the feet.",
    },
    "five-of-pentacles": {
        keywords: ["Hardship", "Isolation", "Asking for help"],
        meaning: "Times feel hard and you may feel alone. Support might be closer than it appears.",
        reversed: "Recovery may be beginning as you find help and regain your footing.",
        symbolism: "Two figures struggle through snow past a lit church window, unaware that shelter is close by.",
    },
    "six-of-pentacles": {
        keywords: ["Generosity", "Giving", "Receiving"],
        meaning: "Notice the balance of giving and receiving. Support works best when it preserves dignity on both sides.",
        reversed: "Help may come with strings attached, or you may be giving more than you can afford.",
        symbolism: "A merchant holds balanced scales while sharing coins, showing measured and fair generosity.",
    },
    "seven-of-pentacles": {
        keywords: ["Patience", "Assessment", "Long-term growth"],
        meaning: "Pause and assess your efforts. Good results take time, so decide what deserves more of yours.",
        reversed: "You may feel impatient with slow progress, or be investing in the wrong thing.",
        symbolism: "A farmer leans on a tool and studies the growing coins, taking stock before continuing the work.",
    },
    "eight-of-pentacles": {
        keywords: ["Practice", "Dedication", "Mastery"],
        meaning: "Steady practice is paying off. Keep showing up and improving one small piece at a time.",
        reversed: "Perfectionism or a lack of motivation may be getting in the way of your progress.",
        symbolism: "An artisan carefully carves coin after coin, showing skill built through repetition.",
    },
    "nine-of-pentacles": {
        keywords: ["Independence", "Self-worth", "Enjoyment"],
        meaning: "Enjoy what you've built for yourself. You've earned this sense of comfort and independence.",
        reversed: "You may be overworking, or relying on possessions to feel secure.",
        symbolism: "A well-dressed figure stands alone in a rich garden. The hooded falcon shows discipline and refinement.",
    },
    "ten-of-pentacles": {
        keywords: ["Legacy", "Family", "Long-term security"],
        meaning: "Think about what lasts. This card speaks to lasting security, family and what you pass on.",
        reversed: "Family or financial pressures may be challenging your sense of stability.",
        symbolism: "Several generations gather beneath an archway, surrounded by coins, showing wealth that endures over time.",
    },
    "page-of-pentacles": {
        keywords: ["Study", "Ambition", "First steps"],
        meaning: "Start small and stay committed. A new goal or skill will grow with steady attention.",
        reversed: "Procrastination or a lack of follow-through may be delaying your goals.",
        symbolism: "A young figure studies a single coin with care while standing in a fertile field full of possibility.",
    },
    "knight-of-pentacles": {
        keywords: ["Routine", "Reliability", "Hard work"],
        meaning: "Slow and steady works here. Keep your commitments and trust the routine you're building.",
        reversed: "Routine may have become a rut, or perfectionism could be slowing you down.",
        symbolism: "A knight sits still on a heavy horse overlooking ploughed fields, showing patience and dependable effort.",
    },
    "queen-of-pentacles": {
        keywords: ["Nurture", "Practicality", "Comfort"],
        meaning: "Care for your home, body and resources. Practical kindness can steady everyone around you.",
        reversed: "You may be neglecting yourself while taking care of everything else.",
        symbolism: "She cradles a coin in a blooming garden. The rabbit nearby represents abundance and a grounded life.",
    },
    "king-of-pentacles": {
        keywords: ["Abundance", "Discipline", "Security"],
        meaning: "Your steady effort has created something solid. Lead with generosity, patience and good judgment.",
        reversed: "Too much focus on status or money may be crowding out what matters most.",
        symbolism: "He sits among grapevines on a throne decorated with bulls, showing wealth, stability and earned success.",
    },
};
