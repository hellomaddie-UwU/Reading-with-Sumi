import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { HeartHand } from "@untitledui/icons";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppNavbar } from "@/components/application/app-navigation/app-navbar";
import { ChartTooltipContent } from "@/components/application/charts/charts-base";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import "@/components/journal/my-journey.css";
import { moods } from "@/utils/cycles";
import type { JournalEntry } from "@/utils/journal-storage";
import { getJournalEntries } from "@/utils/journal-storage";
import type { JourneyBucket, JourneyPeriod } from "@/utils/journey";
import { journeyPeriods, summarizeJourney } from "@/utils/journey";

const axisTick = { fill: "var(--color-text-tertiary)", fontSize: 12 };

const ChartCard = ({ title, description, children, className }: { title: string; description?: ReactNode; children: ReactNode; className?: string }) => (
    <section className={`rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset ${className ?? ""}`}>
        <h2 className="text-lg font-semibold text-primary">{title}</h2>
        {description && <p className="mt-1 text-sm text-tertiary">{description}</p>}
        <div className="mt-5">{children}</div>
    </section>
);

const MoodDot = ({ colorVar }: { colorVar: string }) => <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full" style={{ background: colorVar }} />;

/** Horizontal bars for a short ranked list, labelled so no color is needed to read them. */
const RankedBars = ({ items, emptyMessage }: { items: { label: string; count: number }[]; emptyMessage: string }) => {
    const max = Math.max(...items.map((item) => item.count), 0);
    if (max === 0) return <p className="text-sm text-tertiary">{emptyMessage}</p>;

    return (
        <ul className="flex flex-col gap-3">
            {items.map((item) => (
                <li key={item.label}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="font-medium text-secondary">{item.label}</span>
                        <span className="text-tertiary">{item.count === 1 ? "1 entry" : `${item.count} entries`}</span>
                    </div>
                    <div className="mt-1.5 h-2 rounded-full bg-secondary">
                        {item.count > 0 && <div className="h-full rounded-full bg-brand-solid" style={{ width: `${(item.count / max) * 100}%` }} />}
                    </div>
                </li>
            ))}
        </ul>
    );
};

const CyclesTable = ({ buckets, bucketName }: { buckets: JourneyBucket[]; bucketName: string }) => (
    <details className="mt-4 text-sm">
        <summary className="cursor-pointer font-medium text-tertiary">View as table</summary>
        <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left">
                <thead className="text-tertiary">
                    <tr>
                        <th className="py-1.5 pr-4 font-medium capitalize">{bucketName}</th>
                        {moods.map((mood) => (
                            <th key={mood.id} className="py-1.5 pr-4 font-medium">
                                {mood.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="text-secondary">
                    {buckets.map((bucket) => (
                        <tr key={bucket.fullLabel} className="border-t border-secondary">
                            <td className="py-1.5 pr-4">{bucket.fullLabel}</td>
                            {moods.map((mood) => (
                                <td key={mood.id} className="py-1.5 pr-4">
                                    {bucket[mood.id]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </details>
);

const SupportNote = ({ count }: { count: number }) => (
    <section aria-labelledby="support-note-title" className="flex flex-col gap-4 rounded-xl bg-secondary p-5 sm:flex-row">
        <FeaturedIcon icon={HeartHand} color="brand" theme="light" size="lg" />
        <div>
            <h2 id="support-note-title" className="text-md font-semibold text-primary">
                Some of your writing may be hard to carry alone
            </h2>
            <p className="mt-1 text-sm text-tertiary">
                Cycles noticed words in {count === 1 ? "1 entry" : `${count} entries`} that can come up when someone isn't feeling safe. It only reads words, so
                it may be wrong. If you're struggling, you don't have to handle it alone.
            </p>
            <ul className="mt-3 flex flex-col gap-1 text-sm text-secondary">
                <li>If you're in immediate danger, call your local emergency number.</li>
                <li>
                    In the US, call or text <span className="font-semibold">988</span> to reach the Suicide &amp; Crisis Lifeline.
                </li>
                <li>
                    In the UK and Ireland, call Samaritans on <span className="font-semibold whitespace-nowrap">116 123</span>.
                </li>
                <li>
                    Anywhere else, find a free local helpline at{" "}
                    <a href="https://findahelpline.com" target="_blank" rel="noreferrer" className="font-semibold text-brand-secondary underline">
                        findahelpline.com
                    </a>
                    .
                </li>
            </ul>
        </div>
    </section>
);

export const MyJourneyScreen = () => {
    const [entries, setEntries] = useState<JournalEntry[] | null>(null);
    const [period, setPeriod] = useState<JourneyPeriod>("12-months");

    useEffect(() => {
        let isCurrent = true;

        getJournalEntries()
            .catch(() => [])
            .then((saved) => {
                if (isCurrent) setEntries(saved);
            });

        return () => {
            isCurrent = false;
        };
    }, []);

    const summary = useMemo(() => (entries ? summarizeJourney(entries, period) : null), [entries, period]);
    const periodInfo = journeyPeriods.find((item) => item.id === period)!;
    const bucketLabel = (_label: ReactNode, payload: readonly { payload?: unknown }[]) => (payload[0]?.payload as JourneyBucket | undefined)?.fullLabel ?? "";

    return (
        <div className="min-h-dvh bg-primary">
            <AppNavbar />

            <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-display-xs font-semibold text-primary">My Journey</h1>
                    <ButtonGroup
                        aria-label="Time period"
                        disallowEmptySelection
                        selectedKeys={new Set([period])}
                        onSelectionChange={(keys) => {
                            const [key] = [...keys];
                            if (key) setPeriod(key as JourneyPeriod);
                        }}
                    >
                        {journeyPeriods.map((item) => (
                            <ButtonGroupItem key={item.id} id={item.id}>
                                {item.label}
                            </ButtonGroupItem>
                        ))}
                    </ButtonGroup>
                </div>

                {summary && summary.entryCount === 0 && (
                    <p className="mt-16 text-center text-md text-tertiary">No entries in this period yet. Your journey will appear here as you write.</p>
                )}

                {summary && summary.entryCount > 0 && (
                    <div className="mt-8 flex flex-col gap-6">
                        {summary.moodCounts["needs-care"] > 0 && <SupportNote count={summary.moodCounts["needs-care"]} />}

                        <ul aria-label="Entries by mood" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                            {moods.map((mood) => (
                                <li key={mood.id} className="rounded-xl bg-primary p-4 shadow-xs ring-1 ring-secondary ring-inset">
                                    <p className="flex items-center gap-2 text-sm font-medium text-tertiary">
                                        <MoodDot colorVar={mood.colorVar} />
                                        {mood.label}
                                    </p>
                                    <p className="mt-2 text-display-xs font-semibold text-primary">{summary.moodCounts[mood.id]}</p>
                                </li>
                            ))}
                        </ul>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <ChartCard
                                title="Cycles"
                                description={
                                    <>
                                        The mood of your entries each {periodInfo.bucketName}, estimated from the words you used. It runs only on this device
                                        and can get things wrong.
                                        {summary.readEntryCount < summary.entryCount &&
                                            ` ${summary.entryCount - summary.readEntryCount} of your ${summary.entryCount} entries had no writing to read.`}
                                    </>
                                }
                            >
                                <ul aria-label="Mood legend" className="mb-4 flex flex-wrap gap-x-4 gap-y-2">
                                    {moods.map((mood) => (
                                        <li key={mood.id} className="flex items-center gap-2 text-sm text-tertiary">
                                            <MoodDot colorVar={mood.colorVar} />
                                            {mood.label}
                                        </li>
                                    ))}
                                </ul>
                                <div className="h-64" aria-hidden="true">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={summary.buckets} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                                            <CartesianGrid vertical={false} stroke="var(--color-border-secondary)" />
                                            <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                                            <YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} />
                                            <Tooltip
                                                cursor={{ fill: "var(--color-bg-secondary)" }}
                                                content={<ChartTooltipContent labelFormatter={bucketLabel} />}
                                            />
                                            {moods.map((mood, index) => (
                                                <Bar
                                                    key={mood.id}
                                                    dataKey={mood.id}
                                                    name={mood.label}
                                                    stackId="moods"
                                                    fill={mood.colorVar}
                                                    stroke="var(--color-bg-primary)"
                                                    strokeWidth={2}
                                                    maxBarSize={40}
                                                    radius={index === moods.length - 1 ? [4, 4, 0, 0] : 0}
                                                />
                                            ))}
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <CyclesTable buckets={summary.buckets} bucketName={periodInfo.bucketName} />
                            </ChartCard>

                            <ChartCard title="Entries over time" description={`How many entries you wrote each ${periodInfo.bucketName}.`}>
                                <div className="h-64" aria-hidden="true">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={summary.buckets} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                                            <CartesianGrid vertical={false} stroke="var(--color-border-secondary)" />
                                            <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                                            <YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} />
                                            <Tooltip
                                                cursor={{ fill: "var(--color-bg-secondary)" }}
                                                content={
                                                    <ChartTooltipContent
                                                        formatter={(value) => (value === 1 ? "1 entry" : `${value} entries`)}
                                                        labelFormatter={bucketLabel}
                                                    />
                                                }
                                            />
                                            <Bar dataKey="entries" name="Entries" fill="var(--color-bg-brand-solid)" maxBarSize={40} radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <ul className="sr-only">
                                    {summary.buckets.map((bucket) => (
                                        <li key={bucket.fullLabel}>
                                            {bucket.fullLabel}: {bucket.entries} entries
                                        </li>
                                    ))}
                                </ul>
                            </ChartCard>

                            <ChartCard title="Most frequent cards" description="The tarot cards that come up most often in your entries.">
                                <RankedBars
                                    items={summary.topCards.map((card) => ({ label: card.name, count: card.count }))}
                                    emptyMessage="No entries in this period have a tarot card yet."
                                />
                            </ChartCard>

                            <ChartCard
                                title="Arcana and suit mix"
                                description="How the cards in your entries split across the Major Arcana and the four suits."
                            >
                                <RankedBars
                                    items={summary.cardGroups.map((group) => ({ label: group.label, count: group.count }))}
                                    emptyMessage="No entries in this period have a tarot card yet."
                                />
                            </ChartCard>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
