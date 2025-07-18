import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router";
import {
  updateLineNumbers,
  saveDocument,
  fetchDocument,
  setEditorContent,
  handleTabInsert,
  handleManualPaste,
  syncScroll,
  handleShare,
} from "@/utils/TextEditorUtils";

let saveTimeout: ReturnType<typeof setTimeout>;

const TextEditor = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const lineNumbersRef = useRef<HTMLDivElement | null>(null);
  const [text, setText] = useState("");
  const [lineCount, setLineCount] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [documentExists, setDocumentExists] = useState(false);
  const { id } = useParams();

  const updateLines = () => {
    updateLineNumbers(editorRef, setLineCount);
  };

  const handleInput = () => {
    if (!editorRef.current) return;

    const content = editorRef.current.innerText;
    setText(content);
    updateLines();

    clearTimeout(saveTimeout);
    setIsSaving(true);

    saveTimeout = setTimeout(async () => {
      try {
        await saveDocument(id, content);
        setIsSaving(false);
        setDocumentExists(true);
      } catch (error) {
        setIsSaving(false);
        console.error("Auto-save failed:", error);
      }
    }, 300);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    handleManualPaste(e);
    if (!editorRef.current) return;

    const content = editorRef.current.innerText;
    setText(content);
    updateLines();

    clearTimeout(saveTimeout);
    setIsSaving(true);

    saveTimeout = setTimeout(async () => {
      try {
        await saveDocument(id, content);
        setIsSaving(false);
        setDocumentExists(true);
      } catch (error) {
        setIsSaving(false);
        console.error("Auto-save failed:", error);
      }
    }, 700);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    handleTabInsert(e);
  };

  const handleScroll = () => {
    syncScroll(editorRef, lineNumbersRef);
  };

  const handleShareClick = async () => {
    await handleShare(id);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  useEffect(() => {
    const loadDocument = async () => {
      setIsLoading(true);
      try {
        const document = await fetchDocument(id, setDocumentExists);
        if (document && document.data) {
          setEditorContent(document.data, editorRef, setText, updateLines);
        } else {
          const defaultText = "Welcome to the text editor!\n\nStart typing here...";
          setEditorContent(defaultText, editorRef, setText, updateLines);
          setDocumentExists(false);
        }
      } catch (error) {
        console.error("Error loading document:", error);
        const defaultText = "Welcome to the text editor!\n\nStart typing here...";
        setEditorContent(defaultText, editorRef, setText, updateLines);
        setDocumentExists(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [id]);

  useEffect(() => {
    updateLines();
  }, [text]);

  const lineNumbers = Array.from({ length: Math.max(lineCount, 20) }, (_, i) => i + 1);

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">
            Now this tool works slowly because I moved the backend to a free service. It was costing money with no users 🥲
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto h-screen bg-gray-900 text-gray-100 font-mono text-sm flex flex-col relative">
      {showToast && (
        <div className="fixed top-11 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium">Link copied!</span>
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="ml-4 text-gray-300">{id || "hirendhola"}</span>
        </div>
        <div className="flex items-center space-x-2">
          {isSaving ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-400"></div>
              <span className="text-blue-400 text-xs">Saving...</span>
            </div>
          ) : (
            <span className="text-blue-400 text-xs">{documentExists ? "Saved" : "Ready"}</span>
          )}
          <button
            onClick={handleShareClick}
            className="bg-blue-400 hover:bg-gray-200 hover:text-gray-900 text-white px-3 py-2 rounded text-[15px] transition-colors duration-200 flex items-center text-center"
          >
            Share
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div
          ref={lineNumbersRef}
          className="bg-gray-800 border-r border-gray-700 px-3 py-4 text-gray-500 text-right select-none overflow-hidden custom-scrollbar"
          style={{ width: "40px" }}
        >
          {lineNumbers.map((num) => (
            <div key={num} className="leading-6 h-6">
              {num}
            </div>
          ))}
        </div>

        <div className="flex-1 relative">
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            className="w-full h-full p-4 outline-none resize-none overflow-auto leading-6 custom-scrollbar"
            style={{
              whiteSpace: "pre-wrap",
              overflowWrap: "break-word",
              minHeight: "100%",
              backgroundColor: "transparent",
            }}
            suppressContentEditableWarning
          />
        </div>
      </div>

      <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 text-xs text-gray-400 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span>UTF-8</span>
          <span>Plain Text</span>
          <span className="text-green-500">Encrypted</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Ln {lineCount}</span>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
