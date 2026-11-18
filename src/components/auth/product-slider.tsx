import type { FocusEvent } from "react";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "@untitledui/icons";
import { Carousel, useCarousel } from "@/components/application/carousel/carousel-base";
import { cx } from "@/utils/cx";

const AUTO_ADVANCE_MS = 5000;

const slides = [
    {
        title: "Start from a card, not a blank page",
        description: "Pull a card or log one from your own deck, and let it become the prompt for your entry.",
    },
    {
        title: "Come back without the guilt",
        description: "No streaks to break. Your past entries are waiting in the Catalogue whenever you return.",
    },
    {
        title: "Understand what you pulled",
        description: "Read each card's meaning and symbolism in the Learning Hub, right where you journal.",
    },
    {
        title: "See how your thinking has changed",
        description: "Scroll back through the Catalogue and reread what you wrote about the same worry.",
    },
];

const controlStyles =
    "flex size-10 cursor-pointer items-center justify-center rounded-full text-white outline-white transition duration-100 ease-linear hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2";

/** Moves to the next slide on a timer, restarting whenever the slide changes. */
const AutoAdvance = ({ isPaused }: { isPaused: boolean }) => {
    const { api, selectedIndex } = useCarousel();

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!api || isPaused || prefersReducedMotion) return;

        const timer = window.setTimeout(() => api.scrollNext(), AUTO_ADVANCE_MS);
        return () => window.clearTimeout(timer);
    }, [api, isPaused, selectedIndex]);

    return null;
};

export const ProductSlider = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isKeyboardFocused, setIsKeyboardFocused] = useState(false);

    const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsKeyboardFocused(false);
    };

    return (
        <Carousel.Root
            opts={{ loop: true }}
            aria-label="About Reading with Sumi"
            className="flex size-full flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={(event) => setIsKeyboardFocused(event.target.matches(":focus-visible"))}
            onBlur={handleBlur}
        >
            <AutoAdvance isPaused={isHovered || isKeyboardFocused} />

            <div className="min-h-0 flex-1">
                <Carousel.Content className="h-full items-center">
                    {slides.map((slide, index) => (
                        <Carousel.Item key={slide.title} aria-label={`${index + 1} of ${slides.length}`}>
                            <div className="mx-auto max-w-md px-4 text-center text-white">
                                <h2 className="text-display-sm font-semibold">{slide.title}</h2>
                                <p className="mt-4 text-lg">{slide.description}</p>
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel.Content>
            </div>

            <div className="flex items-center justify-center gap-3">
                <Carousel.PrevTrigger className={controlStyles}>
                    <ArrowLeft className="size-5" />
                </Carousel.PrevTrigger>

                <Carousel.IndicatorGroup aria-label="Choose a slide" className="flex items-center">
                    {slides.map((slide, index) => (
                        <Carousel.Indicator key={slide.title} index={index}>
                            {({ isSelected, onClick }) => (
                                <button
                                    type="button"
                                    aria-label={`Go to slide ${index + 1}`}
                                    aria-current={isSelected ? "true" : undefined}
                                    onClick={onClick}
                                    className="flex size-6 cursor-pointer items-center justify-center rounded-full outline-white focus-visible:outline-2"
                                >
                                    <span className={cx("size-2 rounded-full transition duration-100 ease-linear", isSelected ? "bg-white" : "bg-white/40")} />
                                </button>
                            )}
                        </Carousel.Indicator>
                    ))}
                </Carousel.IndicatorGroup>

                <Carousel.NextTrigger className={controlStyles}>
                    <ArrowRight className="size-5" />
                </Carousel.NextTrigger>
            </div>
        </Carousel.Root>
    );
};
