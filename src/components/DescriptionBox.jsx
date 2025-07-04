import { EditorContent, BubbleMenu, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

function EditMenu({ editor }) {
    if (!editor) return null;

    return (
        <BubbleMenu editor={editor}>
            <div className="bubble-menu">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'is-active' : ''}
                >
                    Bold
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'is-active' : ''}
                >
                    Italic
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={editor.isActive('strike') ? 'is-active' : ''}
                >
                    Strike
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'is-active' : ''}
                >
                    Bullet List
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'is-active' : ''}
                >
                    Ordered List
                </button>
            </div>
        </BubbleMenu>
    )
}

export default function DescriptionBox({ description, onUpdate }) {
    const extensions = [StarterKit];
    const content = description || "";
    
    const editor = useEditor({
        extensions: extensions,
        content: content
    });

    useEffect(() => {
        if (editor && description !== editor.getHTML()) {
            editor.commands.setContent(description || "", false);
        }
    }, [description, editor]);

    editor.on('update', ({ editor }) => {
        const html = editor.getHTML();
        onUpdate(html);
    });

    return (
        editor &&
        <>
            <EditorContent style={{ height: "100%" }} editor={editor}/>
            <EditMenu editor={editor}/>
        </>
    )
}