import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import type { Editor, JSONContent, Range } from "@tiptap/core";
import { Extension } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { NodeSelection } from "@tiptap/pm/state";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Suggestion, { type SuggestionOptions, type SuggestionProps } from "@tiptap/suggestion";
import {
    AlignLeft,
    Bold01,
    CheckSquare,
    Code01,
    Code02,
    Dotpoints01,
    Hash01,
    Heading01,
    Heading02,
    Image01,
    Italic01,
    List,
    Minus,
    Strikethrough01,
    Type01,
    Underline01,
} from "@untitledui/icons";
import { cx } from "@/utils/cx";
import "./rich-text-editor.css";

interface SlashCommand {
    title: string;
    description: string;
    icon: FC<{ className?: string }>;
    run: (editor: Editor, range: Range, openImagePicker: () => void) => void;
}

interface SlashMenuState {
    items: SlashCommand[];
    rect: DOMRect | null;
    select: (item: SlashCommand) => void;
}

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"];
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

const getImageFiles = (files?: FileList | null) => Array.from(files ?? []).filter((file) => file.type.startsWith("image/"));

const readImageFile = (file: File) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });

const slashCommands: SlashCommand[] = [
    { title: "Text", description: "Plain paragraph", icon: Type01, run: (editor, range) => editor.chain().focus().deleteRange(range).setParagraph().run() },
    {
        title: "Heading 1",
        description: "Large section heading",
        icon: Heading01,
        run: (editor, range) => editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run(),
    },
    {
        title: "Heading 2",
        description: "Medium section heading",
        icon: Heading02,
        run: (editor, range) => editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run(),
    },
    {
        title: "Heading 3",
        description: "Small section heading",
        icon: Hash01,
        run: (editor, range) => editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run(),
    },
    {
        title: "Bulleted list",
        description: "Simple bulleted list",
        icon: Dotpoints01,
        run: (editor, range) => editor.chain().focus().deleteRange(range).toggleBulletList().run(),
    },
    {
        title: "Numbered list",
        description: "List with numbers",
        icon: List,
        run: (editor, range) => editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
    },
    {
        title: "To-do list",
        description: "Track items with checkboxes",
        icon: CheckSquare,
        run: (editor, range) => editor.chain().focus().deleteRange(range).toggleTaskList().run(),
    },
    {
        title: "Quote",
        description: "Capture a quote",
        icon: AlignLeft,
        run: (editor, range) => editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
    },
    {
        title: "Image",
        description: "Upload an image",
        icon: Image01,
        run: (editor, range, openImagePicker) => {
            editor.chain().focus().deleteRange(range).run();
            openImagePicker();
        },
    },
    {
        title: "Divider",
        description: "Separate sections",
        icon: Minus,
        run: (editor, range) => editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
    },
    { title: "Code", description: "Code block", icon: Code02, run: (editor, range) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run() },
];

const SlashCommandsExtension = Extension.create<{
    render?: SuggestionOptions<SlashCommand, SlashCommand>["render"];
    openImagePicker?: () => void;
}>({
    name: "slashCommands",

    addProseMirrorPlugins() {
        return [
            Suggestion<SlashCommand, SlashCommand>({
                editor: this.editor,
                char: "/",
                items: ({ query }) => slashCommands.filter((command) => command.title.toLowerCase().includes(query.toLowerCase())),
                command: ({ editor, range, props }) => props.run(editor, range, () => this.options.openImagePicker?.()),
                render: this.options.render,
            }),
        ];
    },
});

const SelectionToolbar = ({ editor }: { editor: Editor }) => {
    const active = useEditorState({
        editor,
        selector: ({ editor: current }) => ({
            bold: current.isActive("bold"),
            italic: current.isActive("italic"),
            underline: current.isActive("underline"),
            strike: current.isActive("strike"),
            code: current.isActive("code"),
        }),
    });

    const actions = [
        { label: "Bold", icon: Bold01, isActive: active.bold, run: () => editor.chain().focus().toggleBold().run() },
        { label: "Italic", icon: Italic01, isActive: active.italic, run: () => editor.chain().focus().toggleItalic().run() },
        { label: "Underline", icon: Underline01, isActive: active.underline, run: () => editor.chain().focus().toggleUnderline().run() },
        { label: "Strikethrough", icon: Strikethrough01, isActive: active.strike, run: () => editor.chain().focus().toggleStrike().run() },
        { label: "Inline code", icon: Code01, isActive: active.code, run: () => editor.chain().focus().toggleCode().run() },
    ];

    return (
        <BubbleMenu editor={editor} className="z-20 flex gap-0.5 rounded-lg bg-primary p-1 shadow-lg ring-1 ring-secondary_alt">
            {actions.map(({ label, icon: Icon, isActive, run }) => (
                <button
                    key={label}
                    type="button"
                    aria-label={label}
                    aria-pressed={isActive}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={run}
                    className={cx(
                        "flex size-8 cursor-pointer items-center justify-center rounded-md text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:outline-2",
                        isActive && "bg-active text-fg-brand-primary",
                    )}
                >
                    <Icon className="size-4" />
                </button>
            ))}
        </BubbleMenu>
    );
};

const SLASH_MENU_HEIGHT = 320;

const SlashMenu = ({ menu, activeIndex }: { menu: SlashMenuState; activeIndex: number }) => {
    const activeItemRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        activeItemRef.current?.scrollIntoView({ block: "nearest" });
    }, [activeIndex]);

    if (!menu.rect || menu.items.length === 0) return null;

    const opensAbove = menu.rect.bottom + SLASH_MENU_HEIGHT > window.innerHeight;

    return (
        <div
            role="listbox"
            aria-label="Insert a block"
            style={{
                left: menu.rect.left,
                maxHeight: SLASH_MENU_HEIGHT,
                ...(opensAbove ? { bottom: window.innerHeight - menu.rect.top + 4 } : { top: menu.rect.bottom + 4 }),
            }}
            className="fixed z-30 w-72 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-lg bg-primary p-1 shadow-lg ring-1 ring-secondary_alt"
        >
            {menu.items.map((item, index) => (
                <button
                    key={item.title}
                    ref={index === activeIndex ? activeItemRef : undefined}
                    type="button"
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => menu.select(item)}
                    className={cx(
                        "flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-left transition duration-100 ease-linear hover:bg-primary_hover",
                        index === activeIndex && "bg-active",
                    )}
                >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary ring-1 ring-secondary">
                        <item.icon className="size-4 text-fg-quaternary" />
                    </span>
                    <span className="flex min-w-0 flex-col">
                        <span className="text-sm font-medium text-secondary">{item.title}</span>
                        <span className="truncate text-xs text-tertiary">{item.description}</span>
                    </span>
                </button>
            ))}
        </div>
    );
};

interface RichTextEditorProps {
    initialContent?: JSONContent;
    onChange: (content: JSONContent) => void;
}

export const RichTextEditor = ({ initialContent, onChange }: RichTextEditorProps) => {
    const [menu, setMenu] = useState<SlashMenuState | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [imageError, setImageError] = useState<string>();

    const editorRef = useRef<Editor | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<SlashMenuState | null>(null);
    const activeIndexRef = useRef(0);
    const onChangeRef = useRef(onChange);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    const updateActiveIndex = (index: number) => {
        activeIndexRef.current = index;
        setActiveIndex(index);
    };

    const updateMenu = (next: SlashMenuState | null) => {
        menuRef.current = next;
        setMenu(next);
    };

    const renderSlashMenu = () => {
        const syncMenu = (props: SuggestionProps<SlashCommand, SlashCommand>) => {
            updateMenu({ items: props.items, rect: props.clientRect?.() ?? null, select: props.command });
            updateActiveIndex(0);
        };

        return {
            onStart: syncMenu,
            onUpdate: syncMenu,
            onExit: () => updateMenu(null),
            onKeyDown: ({ event }: { event: KeyboardEvent }) => {
                const current = menuRef.current;
                if (!current || current.items.length === 0) return false;

                const itemCount = current.items.length;

                if (event.key === "ArrowDown") {
                    updateActiveIndex((activeIndexRef.current + 1) % itemCount);
                    return true;
                }
                if (event.key === "ArrowUp") {
                    updateActiveIndex((activeIndexRef.current - 1 + itemCount) % itemCount);
                    return true;
                }
                if (event.key === "Enter") {
                    current.select(current.items[activeIndexRef.current]);
                    return true;
                }
                if (event.key === "Escape") {
                    updateMenu(null);
                    return true;
                }

                return false;
            },
        };
    };

    const insertImages = async (files: File[], position?: number) => {
        const current = editorRef.current;
        if (!current) return;

        const validFiles = files.filter((file) => IMAGE_TYPES.includes(file.type) && file.size <= MAX_IMAGE_SIZE_BYTES);
        setImageError(validFiles.length < files.length ? "Images must be PNG, JPG, GIF or WEBP, and 10MB or smaller." : undefined);

        try {
            let insertAt = position;

            for (const file of validFiles) {
                const src = await readImageFile(file);
                if (current.isDestroyed) return;

                current
                    .chain()
                    .focus(insertAt)
                    .insertContent({ type: "image", attrs: { src, alt: file.name } })
                    .run();
                insertAt = undefined;

                // Move past the new image so the next image or keystroke doesn't replace it.
                const { selection, doc } = current.state;
                if (selection instanceof NodeSelection) {
                    current.commands.setTextSelection(Math.min(selection.to + 1, doc.content.size));
                }
            }
        } catch {
            setImageError("That image couldn't be added. Please try again.");
        }
    };

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
            Placeholder.configure({ placeholder: "Start writing, or press / for commands" }),
            TaskList,
            TaskItem.configure({ nested: true }),
            Image.configure({ allowBase64: true }),
            SlashCommandsExtension.configure({ render: renderSlashMenu, openImagePicker: () => fileInputRef.current?.click() }),
        ],
        content: initialContent,
        editorProps: {
            attributes: { class: "rich-text-editor prose max-w-none", "aria-label": "Journal entry" },
            handlePaste: (_view, event) => {
                const files = getImageFiles(event.clipboardData?.files);
                if (files.length === 0) return false;

                insertImages(files);
                return true;
            },
            handleDrop: (view, event, _slice, moved) => {
                const files = getImageFiles(event.dataTransfer?.files);
                if (moved || files.length === 0) return false;

                event.preventDefault();
                insertImages(files, view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos);
                return true;
            },
        },
        onUpdate: ({ editor: current }) => onChangeRef.current(current.getJSON()),
    });

    useEffect(() => {
        editorRef.current = editor;
    }, [editor]);

    return (
        <div>
            <SelectionToolbar editor={editor} />
            <EditorContent editor={editor} />
            {menu && <SlashMenu menu={menu} activeIndex={activeIndex} />}

            <input
                ref={fileInputRef}
                hidden
                multiple
                type="file"
                accept={IMAGE_TYPES.join(",")}
                aria-label="Upload images to this entry"
                onChange={(event) => {
                    insertImages(Array.from(event.target.files ?? []));
                    event.target.value = "";
                }}
            />

            {imageError && (
                <p role="alert" className="mt-2 text-sm text-error-primary">
                    {imageError}
                </p>
            )}
        </div>
    );
};
