import type { FormEvent } from "react";
import { useId, useState } from "react";
import { ArrowLeft } from "@untitledui/icons";
import { Checkbox as AriaCheckbox, CheckboxGroup as AriaCheckboxGroup, Radio as AriaRadio } from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import { CheckboxBase } from "@/components/base/checkbox/checkbox";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { ProgressBarBase } from "@/components/base/progress-indicators/progress-indicators";
import { RadioButtonBase, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { UntitledLogo } from "@/components/foundations/logo/untitledui-logo";
import { cx } from "@/utils/cx";
import { saveDeckPreference } from "@/utils/journal-storage";

interface Option {
    title: string;
    description?: string;
}

interface Question {
    id: string;
    title: string;
    allowsMultiple?: boolean;
    options: Option[];
}

type Answers = Record<string, string | string[] | undefined>;

const DECK_OWNER_ANSWER = "Yes, I have a deck";

const questions: Question[] = [
    {
        id: "reason",
        title: "What brings you to journaling?",
        allowsMultiple: true,
        options: [{ title: "Work stress" }, { title: "Relationships" }, { title: "A big life change" }, { title: "Understanding myself better" }],
    },
    {
        id: "history",
        title: "How has journaling gone for you so far?",
        options: [{ title: "I'm new to it" }, { title: "I start and stop" }, { title: "I used to journal regularly" }],
    },
    {
        id: "obstacles",
        title: "What gets in the way of journaling?",
        allowsMultiple: true,
        options: [{ title: "Blank pages" }, { title: "Guilt after missed days" }, { title: "Scattered journals" }, { title: "Not knowing what to write" }],
    },
    {
        id: "timing",
        title: "When do you usually reflect?",
        options: [{ title: "Late at night" }, { title: "In the morning" }, { title: "After a hard week" }, { title: "No set time" }],
    },
    {
        id: "deck",
        title: "Do you own a tarot deck?",
        options: [
            { title: DECK_OWNER_ANSWER, description: "Log the cards you pull" },
            { title: "Not yet", description: "Pull a card in the app" },
        ],
    },
    {
        id: "tarot",
        title: "How well do you know tarot?",
        options: [{ title: "Just starting" }, { title: "I know some cards and look up the rest" }, { title: "Confident with all 78" }],
    },
    {
        id: "astrology",
        title: "How much do you follow astrology?",
        options: [{ title: "I only know my sun sign" }, { title: "I know my big three" }, { title: "I follow my full chart" }],
    },
];

const getCardStyles = (isSelected: boolean, isFocusVisible: boolean) =>
    cx(
        "flex cursor-pointer items-start gap-3 rounded-xl bg-primary p-4 text-left ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:bg-primary_hover",
        isSelected && "ring-2 ring-brand",
        isFocusVisible && "outline-2 outline-offset-2 outline-focus-ring",
    );

const CardText = ({ title, description }: Option) => (
    <span className="flex flex-col">
        <span className="text-md font-medium text-secondary">{title}</span>
        {description && <span className="text-md text-tertiary">{description}</span>}
    </span>
);

const QuestionOptions = ({
    question,
    labelId,
    value,
    onChange,
}: {
    question: Question;
    labelId: string;
    value: Answers[string];
    onChange: (value: string | string[]) => void;
}) => {
    if (question.allowsMultiple) {
        return (
            <AriaCheckboxGroup aria-labelledby={labelId} value={(value as string[] | undefined) ?? []} onChange={onChange} className="flex flex-col gap-3">
                {question.options.map((option) => (
                    <AriaCheckbox
                        key={option.title}
                        value={option.title}
                        className={({ isSelected, isFocusVisible }) => getCardStyles(isSelected, isFocusVisible)}
                    >
                        {({ isSelected }) => (
                            <>
                                <CheckboxBase size="md" isSelected={isSelected} className="mt-0.5" />
                                <CardText {...option} />
                            </>
                        )}
                    </AriaCheckbox>
                ))}
            </AriaCheckboxGroup>
        );
    }

    return (
        <RadioGroup aria-labelledby={labelId} value={(value as string | undefined) ?? null} onChange={onChange} className="gap-3">
            {question.options.map((option) => (
                <AriaRadio key={option.title} value={option.title} className={({ isSelected, isFocusVisible }) => getCardStyles(isSelected, isFocusVisible)}>
                    {({ isSelected }) => (
                        <>
                            <RadioButtonBase size="md" isSelected={isSelected} className="mt-0.5" />
                            <CardText {...option} />
                        </>
                    )}
                </AriaRadio>
            ))}
        </RadioGroup>
    );
};

export const OnboardingScreen = () => {
    const headingId = useId();

    const [questionIndex, setQuestionIndex] = useState(0);
    const [isNamingDeck, setIsNamingDeck] = useState(false);
    const [answers, setAnswers] = useState<Answers>({});
    const [deckName, setDeckName] = useState("");

    const question = questions[questionIndex];
    const isComplete = questionIndex === questions.length;
    const ownsDeck = answers.deck === DECK_OWNER_ANSWER;

    const answer = question ? answers[question.id] : undefined;
    const canContinue = isNamingDeck ? deckName.trim().length > 0 : Array.isArray(answer) ? answer.length > 0 : Boolean(answer);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!canContinue) return;

        if (question.id === "deck" && ownsDeck && !isNamingDeck) {
            setIsNamingDeck(true);
            return;
        }

        if (question.id === "deck") {
            saveDeckPreference({ hasDeck: ownsDeck, deckName: ownsDeck ? deckName.trim() : undefined });
        }

        setIsNamingDeck(false);
        setQuestionIndex((index) => index + 1);
    };

    const handleBack = () => {
        if (isNamingDeck) {
            setIsNamingDeck(false);
            return;
        }

        const previousIndex = questionIndex - 1;
        setIsNamingDeck(questions[previousIndex].id === "deck" && ownsDeck);
        setQuestionIndex(previousIndex);
    };

    return (
        <main className="flex min-h-dvh items-center justify-center bg-primary px-4 py-12">
            <div className="flex w-full max-w-sm flex-col items-center">
                <UntitledLogo />

                <div className="mt-8 w-full">
                    <span className="sr-only">
                        {questionIndex} of {questions.length} questions completed
                    </span>
                    <ProgressBarBase value={questionIndex} min={0} max={questions.length} />
                </div>

                {isComplete ? (
                    <>
                        <h1 className="mt-8 text-center text-display-xs font-semibold text-primary">You're all set</h1>
                        <Button href="/dashboard" size="lg" className="mt-8 w-full">
                            Go to Dashboard
                        </Button>
                    </>
                ) : (
                    <>
                        <h1 id={headingId} className="mt-8 text-center text-display-xs font-semibold text-primary">
                            {isNamingDeck ? "What do you call your deck?" : question.title}
                        </h1>
                        {!isNamingDeck && question.allowsMultiple && <p className="mt-2 text-center text-md text-tertiary">Select all that apply</p>}

                        <Form validationBehavior="aria" onSubmit={handleSubmit} className="mt-8 flex w-full flex-col gap-6">
                            {isNamingDeck ? (
                                <Input
                                    autoFocus
                                    aria-labelledby={headingId}
                                    name="deckName"
                                    placeholder="Enter a name or nickname"
                                    value={deckName}
                                    onChange={setDeckName}
                                />
                            ) : (
                                <QuestionOptions
                                    key={question.id}
                                    question={question}
                                    labelId={headingId}
                                    value={answer}
                                    onChange={(value) => setAnswers((current) => ({ ...current, [question.id]: value }))}
                                />
                            )}

                            <Button type="submit" size="lg" className="w-full" isDisabled={!canContinue}>
                                Continue
                            </Button>
                        </Form>

                        {(questionIndex > 0 || isNamingDeck) && (
                            <Button color="link-gray" size="sm" iconLeading={ArrowLeft} className="mt-6" onPress={handleBack}>
                                Back
                            </Button>
                        )}
                    </>
                )}
            </div>
        </main>
    );
};
