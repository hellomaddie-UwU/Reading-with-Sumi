import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Trash01 } from "@untitledui/icons";
import { useParams } from "react-router";
import { FileUpload } from "@/components/application/file-upload/file-upload-base";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { RichTextEditor } from "@/components/journal/rich-text-editor";
import { WritingPrompt } from "@/components/journal/writing-prompt";
import type { JournalEntry } from "@/utils/journal-storage";
import { getJournalEntry, saveJournalEntry } from "@/utils/journal-storage";

const AUTOSAVE_DELAY_MS = 800;
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

type SaveStatus = "idle" | "saving" | "saved" | "error";

const saveStatusLabels: Record<SaveStatus, string> = {
    idle: "",
    saving: "Saving...",
    saved: "Saved",
    error: "Couldn't save",
};

export const JournalPostEditorScreen = () => {
    const { entryId } = useParams<{ entryId: string }>();

    const [entry, setEntry] = useState<JournalEntry | null>(null);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
    const [imageUrl, setImageUrl] = useState<string>();
    const [editorVersion, setEditorVersion] = useState(0);

    const entryRef = useRef<JournalEntry | null>(null);
    const hasUnsavedChangesRef = useRef(false);
    const saveTimerRef = useRef<number>(undefined);

    const save = useCallback(async () => {
        window.clearTimeout(saveTimerRef.current);
        if (!entryRef.current || !hasUnsavedChangesRef.current) return;

        hasUnsavedChangesRef.current = false;

        try {
            await saveJournalEntry({ ...entryRef.current, updatedAt: Date.now() });
            if (!hasUnsavedChangesRef.current) setSaveStatus("saved");
        } catch {
            hasUnsavedChangesRef.current = true;
            setSaveStatus("error");
        }
    }, []);

    const updateEntry = useCallback(
        (changes: Partial<JournalEntry>) => {
            if (!entryRef.current) return;

            const next = { ...entryRef.current, ...changes };
            entryRef.current = next;
            hasUnsavedChangesRef.current = true;
            setEntry(next);
            setSaveStatus("saving");

            window.clearTimeout(saveTimerRef.current);
            saveTimerRef.current = window.setTimeout(save, AUTOSAVE_DELAY_MS);
        },
        [save],
    );

    useEffect(() => {
        if (!entryId) return;

        let isCurrent = true;
        const showEntry = (loaded: JournalEntry) => {
            if (!isCurrent) return;
            entryRef.current = loaded;
            setEntry(loaded);
        };

        getJournalEntry(entryId)
            .then((saved) => showEntry(saved ?? { id: entryId, title: "" }))
            .catch(() => {
                showEntry({ id: entryId, title: "" });
                setSaveStatus("error");
            });

        return () => {
            isCurrent = false;
        };
    }, [entryId]);

    useEffect(() => {
        const saveWhenHidden = () => {
            if (document.visibilityState === "hidden") save();
        };

        window.addEventListener("pagehide", save);
        document.addEventListener("visibilitychange", saveWhenHidden);

        return () => {
            window.removeEventListener("pagehide", save);
            document.removeEventListener("visibilitychange", saveWhenHidden);
            save();
        };
    }, [save]);

    const featuredImage = entry?.featuredImage;

    useEffect(() => {
        if (!featuredImage) {
            setImageUrl(undefined);
            return;
        }

        const url = URL.createObjectURL(featuredImage);
        setImageUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [featuredImage]);

    if (!entry) return <main className="min-h-dvh bg-primary" />;

    return (
        <main className="min-h-dvh bg-primary">
            <div className="sticky top-0 z-10 bg-primary">
                <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 md:px-8">
                    <Button href="/dashboard" color="link-gray" size="sm" iconLeading={ArrowLeft}>
                        Dashboard
                    </Button>
                    <p role="status" className="text-sm text-tertiary">
                        {saveStatusLabels[saveStatus]}
                    </p>
                </div>
            </div>

            <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 pt-4 pb-16 md:px-8">
                <Input label="Title" placeholder="Give this entry a title" value={entry.title} onChange={(title) => updateEntry({ title })} />

                <section aria-labelledby="featured-image-heading" className="flex flex-col gap-3">
                    <h2 id="featured-image-heading" className="text-sm font-medium text-secondary">
                        Featured Image
                    </h2>

                    {imageUrl ? (
                        <div className="relative overflow-hidden rounded-xl">
                            <img src={imageUrl} alt="Featured" className="aspect-video w-full object-cover" />
                            <Button
                                color="secondary"
                                size="sm"
                                iconLeading={Trash01}
                                className="absolute top-3 right-3"
                                onPress={() => updateEntry({ featuredImage: undefined })}
                            >
                                Remove
                            </Button>
                        </div>
                    ) : (
                        <FileUpload.DropZone
                            accept="image/png,image/jpeg,image/gif,image/webp"
                            allowsMultiple={false}
                            maxSize={MAX_IMAGE_SIZE_BYTES}
                            hint="PNG, JPG, GIF or WEBP (max. 10MB)"
                            onDropFiles={(files) => updateEntry({ featuredImage: files[0] })}
                        />
                    )}
                </section>

                <WritingPrompt
                    value={entry.writingPrompt}
                    onChange={(writingPrompt) => updateEntry({ writingPrompt })}
                    onReset={() => {
                        updateEntry({ writingPrompt: undefined, content: undefined });
                        setEditorVersion((version) => version + 1);
                    }}
                />

                <RichTextEditor key={editorVersion} initialContent={entry.content} onChange={(content) => updateEntry({ content })} />
            </div>
        </main>
    );
};
