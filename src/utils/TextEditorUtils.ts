// utils/TextEditorUtils.ts

export const API_BASE_URL: string =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export const updateLineNumbers = (
  editorRef: React.RefObject<HTMLDivElement | null>,
  setLineCount: (count: number) => void
): void => {
  if (!editorRef.current) return;
  const content = editorRef.current.innerText;
  const lines = content.split("\n").length;
  setLineCount(lines);
};

export const saveDocument = async (
  id: string | undefined,
  content: string
): Promise<any> => {
  if (!id) return;

  const response = await fetch(`${API_BASE_URL}/api/documents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ textId: id, data: content }),
  });

  if (!response.ok) throw new Error("Failed to save document");
  return response.json();
};

export const fetchDocument = async (
  id: string | undefined,
  setDocumentExists: (exists: boolean) => void
): Promise<{ data: string } | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/documents/${id || "hirendhola"}`
    );

    if (response.status === 404) {
      setDocumentExists(false);
      return null;
    }

    if (!response.ok)
      throw new Error(`Failed to fetch document: ${response.status}`);

    const result = await response.json();
    setDocumentExists(true);
    return result.document;
  } catch (error) {
    console.error("Error fetching document:", error);
    setDocumentExists(false);
    return null;
  }
};

export const setEditorContent = (
  content: string,
  editorRef: React.RefObject<HTMLDivElement | null>,
  setText: (text: string) => void,
  updateLineNumbersFn: () => void
): void => {
  setText(content);

  requestAnimationFrame(() => {
    const editor = editorRef.current;
    if (!editor) return;

    try {
      editor.textContent = content;
    } catch {
      try {
        editor.innerText = content;
      } catch {
        editor.innerHTML = content.replace(/\n/g, "<br>");
      }
    }

    setTimeout(updateLineNumbersFn, 50);
  });
};

export const handleTabInsert = (e: React.KeyboardEvent<HTMLDivElement | null>): void => {
  if (e.key !== "Tab") return;

  e.preventDefault();
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const tabNode = document.createTextNode("    ");
  range.insertNode(tabNode);
  range.setStartAfter(tabNode);
  range.setEndAfter(tabNode);
  selection.removeAllRanges();
  selection.addRange(range);
};

export const handleManualPaste = (
  e: React.ClipboardEvent<HTMLDivElement | null>
): string => {
  e.preventDefault();
  const pastedText = e.clipboardData.getData("text/plain");

  const selection = window.getSelection();
  if (!selection || !selection.rangeCount) return "";

  const range = selection.getRangeAt(0);
  range.deleteContents();

  const textNode = document.createTextNode(pastedText);
  range.insertNode(textNode);

  range.setStartAfter(textNode);
  range.setEndAfter(textNode);
  selection.removeAllRanges();
  selection.addRange(range);

  return pastedText;
};

export const syncScroll = (
  editorRef: React.RefObject<HTMLDivElement | null>,
  lineNumbersRef: React.RefObject<HTMLDivElement | null>
): void => {
  if (editorRef.current && lineNumbersRef.current) {
    lineNumbersRef.current.scrollTop = editorRef.current.scrollTop;
  }
};

export const handleShare = async (id: string | undefined): Promise<void> => {
  try {
    const domain =
      import.meta.env.VITE_FRONTEND_DOMAIN || window.location.origin;
    const shareUrl = `${domain}/${id || "hirendhola"}`;
    await navigator.clipboard.writeText(shareUrl);
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
  }
};
