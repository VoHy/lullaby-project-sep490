'use client';
import { useState, useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function BlogForm({ initialValues = {}, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialValues.title || '');
  const [category, setCategory] = useState(initialValues.category || '');
  const [content, setContent] = useState(initialValues.content || '');
  const [error, setError] = useState('');

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialValues.content || '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  // Helper: decode HTML entities if backend or pasted text is escaped
  const decodeIfNeeded = (s) => {
    if (!s) return '';
    if (s.includes('&lt;') || s.includes('&gt;') || s.includes('&amp;')) {
      try {
        const doc = new DOMParser().parseFromString(s, 'text/html');
        return doc.documentElement.textContent || '';
      } catch (e) {
        return s;
      }
    }
    return s;
  };

  // Try to paste rich HTML from clipboard (best-effort). Requires HTTPS and permissions.
  const pasteFromClipboard = async () => {
    if (!editor) return;
    try {
      // Prefer reading clipboard as text/html when possible
      if (navigator.clipboard && navigator.clipboard.readText) {
        const txt = await navigator.clipboard.readText();
        const html = decodeIfNeeded(txt);
        // If it looks like HTML, insert as HTML, otherwise wrap in <p>
        if (/<[a-z][\s\S]*>/i.test(html)) {
          editor.commands.insertContent(html);
        } else {
          editor.commands.insertContent(`<p>${html}</p>`);
        }
        editor.commands.focus();
        return;
      }
    } catch (e) {
      // ignore and fallback to prompt
    }
    const fallback = prompt('Trình duyệt không cho phép đọc clipboard programmatically. Dán HTML vào đây:');
    if (fallback) {
      const html = decodeIfNeeded(fallback);
      editor.commands.insertContent(/<[a-z][\s\S]*>/i.test(html) ? html : `<p>${html}</p>`);
      editor.commands.focus();
    }
  };

  useEffect(() => {
    if (editor && initialValues.content) {
      editor.commands.setContent(initialValues.content);
    }
  }, [editor, initialValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title || !title.trim()) {
      setError('Tiêu đề là bắt buộc.');
      return;
    }

    const htmlContent = editor ? editor.getHTML() : content;

    onSubmit({
      title: title.trim(),
      category: category.trim(),
      content: htmlContent,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            {initialValues && initialValues.title ? 'Sửa tin tức' : 'Thêm tin tức mới'}
          </h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tiêu đề */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="Nhập tiêu đề..."
            />
          </div>

          {/* Danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="Ví dụ: Chăm sóc mẹ và bé"
            />
          </div>

          {/* Toolbar */}
          {editor && (
            <div className="flex flex-wrap gap-2 border p-2 rounded bg-gray-50">
              <button
                type="button"
                onClick={() => {
                  const html = prompt('Dán HTML vào đây:');
                  if (html) {
                    const decoded = decodeIfNeeded(html);
                    editor.commands.insertContent(/<[a-z][\s\S]*>/i.test(decoded) ? decoded : `<p>${decoded}</p>`);
                    editor.commands.focus();
                  }
                }}
                className="px-2 bg-green-100 rounded text-sm"
              >
                Dán HTML
              </button>
              <button
                type="button"
                onClick={() => pasteFromClipboard()}
                className="px-2 bg-blue-100 rounded text-sm"
              >
                Dán từ clipboard
              </button>
              <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor?.isActive('bold') ? 'bg-purple-200 px-2 rounded' : 'px-2'}>
                B
              </button>
              <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor?.isActive('italic') ? 'bg-purple-200 px-2 rounded' : 'px-2'}>
                I
              </button>
              <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor?.isActive('heading', { level: 2 }) ? 'bg-purple-200 px-2 rounded' : 'px-2'}>
                H2
              </button>
              <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor?.isActive('bulletList') ? 'bg-purple-200 px-2 rounded' : 'px-2'}>
                • List
              </button>
              <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor?.isActive('orderedList') ? 'bg-purple-200 px-2 rounded' : 'px-2'}>
                1. List
              </button>
              <button type="button" onClick={() => editor.chain().focus().undo().run()} className="px-2">
                ↶ Undo
              </button>
              <button type="button" onClick={() => editor.chain().focus().redo().run()} className="px-2">
                ↷ Redo
              </button>
            </div>
          )}

          {/* Editor */}
          <div className="w-full border border-gray-300 rounded-lg p-4 min-h-[200px]">
            <div className="prose prose-lg max-w-none">
              <EditorContent editor={editor} />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Hủy
            </button>
            <button type="submit"
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
