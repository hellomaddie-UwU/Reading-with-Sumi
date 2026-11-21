import { FilterLines } from "@untitledui/icons";
import { Dialog as AriaDialog, DialogTrigger as AriaDialogTrigger, Popover as AriaPopover } from "react-aria-components";
import { DateRangePicker } from "@/components/application/date-picker/date-range-picker";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { MultiSelect } from "@/components/base/select/multi-select";
import { Select } from "@/components/base/select/select";
import type { CardGroup, EntryFilters, SavedCardFilter } from "@/utils/entry-filters";
import { cardGroupOptions, countActiveFilters, emptyEntryFilters, savedCardOptions } from "@/utils/entry-filters";
import { tarotCards } from "@/utils/tarot-cards";

const cardOptions = tarotCards.map((card) => ({ id: card.id, label: card.name }));

interface EntryFiltersButtonProps {
    filters: EntryFilters;
    onChange: (filters: EntryFilters) => void;
}

export const EntryFiltersButton = ({ filters, onChange }: EntryFiltersButtonProps) => {
    const activeCount = countActiveFilters(filters);
    const update = (changes: Partial<EntryFilters>) => onChange({ ...filters, ...changes });

    return (
        <AriaDialogTrigger>
            <Button color="secondary" size="md" iconLeading={FilterLines} aria-label={activeCount ? `Filter, ${activeCount} active` : "Filter"}>
                <span className="flex items-center gap-1.5">
                    Filter
                    {activeCount > 0 && (
                        <Badge size="sm" color="brand" type="pill-color">
                            {activeCount}
                        </Badge>
                    )}
                </span>
            </Button>

            <AriaPopover
                placement="bottom end"
                offset={8}
                className="w-[min(20rem,calc(100vw-2rem))] rounded-xl bg-primary shadow-lg ring-1 ring-secondary_alt outline-hidden"
            >
                <AriaDialog aria-label="Filter entries" className="outline-hidden">
                    {({ close }) => (
                        <div className="flex flex-col gap-4 p-4">
                            <MultiSelect
                                label="Tarot card"
                                placeholder="Any card"
                                items={cardOptions}
                                selectedKeys={filters.cardIds}
                                onSelectionChange={(keys) =>
                                    update({ cardIds: keys === "all" ? new Set(cardOptions.map((card) => card.id)) : new Set([...keys].map(String)) })
                                }
                                onReset={() => update({ cardIds: new Set() })}
                                onSelectAll={() => update({ cardIds: new Set(cardOptions.map((card) => card.id)) })}
                            >
                                {(item) => <MultiSelect.Item id={item.id} label={item.label} />}
                            </MultiSelect>

                            <Select
                                label="Arcana or suit"
                                items={cardGroupOptions}
                                selectedKey={filters.cardGroup}
                                onSelectionChange={(key) => update({ cardGroup: (key ?? "any") as CardGroup })}
                            >
                                {(item) => <Select.Item id={item.id} label={item.label} />}
                            </Select>

                            <div className="flex flex-col gap-1.5">
                                <span className="text-sm font-medium text-secondary">Date range</span>
                                <DateRangePicker aria-label="Date range" value={filters.dateRange} onChange={(dateRange) => update({ dateRange })} />
                            </div>

                            <Select
                                label="Saved card"
                                items={savedCardOptions}
                                selectedKey={filters.savedCard}
                                onSelectionChange={(key) => update({ savedCard: (key ?? "any") as SavedCardFilter })}
                            >
                                {(item) => <Select.Item id={item.id} label={item.label} />}
                            </Select>

                            <div className="grid grid-cols-2 gap-3 border-t border-secondary pt-4">
                                <Button color="secondary" size="sm" onPress={() => onChange(emptyEntryFilters)}>
                                    Clear
                                </Button>
                                <Button size="sm" onPress={close}>
                                    Done
                                </Button>
                            </div>
                        </div>
                    )}
                </AriaDialog>
            </AriaPopover>
        </AriaDialogTrigger>
    );
};
