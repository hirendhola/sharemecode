import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router";

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

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const updateLineNumbers = () => {
    if (!editorRef.current) return;

    const content = editorRef.current.innerText;
    const lines = content.split("\n").length;
    setLineCount(lines);
  };

  const saveDocument = async (content: string) => {
    if (!id) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          textId: id,
          data: content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save document");
      }

      const result = await response.json();
      console.log("Document saved successfully:", result);
      return result;
    } catch (error) {
      console.error("Error saving document:", error);
      throw error;
    }
  };

  const fetchDocument = async () => {
    if (!id) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/${id}`);

      if (response.status === 404) {
        setDocumentExists(false);
        return null;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch document");
      }

      const result = await response.json();
      setDocumentExists(true);
      return result.document;
    } catch (error) {
      console.error("Error fetching document:", error);
      setDocumentExists(false);
      return null;
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerText;
      setText(content);
      updateLineNumbers();

      clearTimeout(saveTimeout);
      setIsSaving(true);

      saveTimeout = setTimeout(async () => {
        try {
          await saveDocument(content);
          setIsSaving(false);
          setDocumentExists(true);
        } catch (error) {
          setIsSaving(false);
          console.error("Auto-save failed:", error);
        }
      }, 700);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text/plain");

    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const textNode = document.createTextNode(pastedText);
    range.insertNode(textNode);

    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);

    if (editorRef.current) {
      const content = editorRef.current.innerText;
      setText(content);
      updateLineNumbers();

      clearTimeout(saveTimeout);
      setIsSaving(true);

      saveTimeout = setTimeout(async () => {
        try {
          await saveDocument(content);
          setIsSaving(false);
          setDocumentExists(true);
        } catch (error) {
          setIsSaving(false);
          console.error("Auto-save failed:", error);
        }
      }, 700);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Tab") {
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
    }
  };

  const handleScroll = () => {
    if (editorRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = editorRef.current.scrollTop;
    }
  };

  const handleShare = async () => {
    try {
      const domain = import.meta.env.FRONTEND_DOMAIN || window.location.origin;
      const shareUrl = `${domain}/${id}`;

      await navigator.clipboard.writeText(shareUrl);

      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  useEffect(() => {
    const loadDocument = async () => {
      if (!id) return;

      setIsLoading(true);

      try {
        const document = await fetchDocument();

        if (document && document.data) {
          setText(document.data);
          if (editorRef.current) {
            editorRef.current.innerText = document.data;
          }
        } else {
          const defaultText =
            "Welcome to the text editor!\n\nStart typing here...";
          setText(defaultText);
          if (editorRef.current) {
            editorRef.current.innerText = defaultText;
          }
        }

        updateLineNumbers();
      } catch (error) {
        console.error("Error loading document:", error);
        const defaultText =
          "Welcome to the text editor!\n\nStart typing here...";
        setText(defaultText);
        if (editorRef.current) {
          editorRef.current.innerText = defaultText;
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [id]);

  useEffect(() => {
    updateLineNumbers();
  }, [text]);

  const lineNumbers = Array.from(
    { length: Math.max(lineCount, 20) },
    (_, i) => i + 1
  );

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-900 text-gray-100 font-mono text-sm flex flex-col relative">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
        
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: #1f2937;
        }
        
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #4b5563 #1f2937;
        }

        .toast-enter {
          opacity: 0;
          transform: translateX(100%);
        }
        
        .toast-enter-active {
          opacity: 1;
          transform: translateX(0);
          transition: opacity 300ms, transform 300ms;
        }
        
        .toast-exit {
          opacity: 1;
          transform: translateX(0);
        }
        
        .toast-exit-active {
          opacity: 0;
          transform: translateX(100%);
          transition: opacity 300ms, transform 300ms;
        }
      `}</style>

      {showToast && (
        <div className="fixed top-11 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-sm font-medium">Link copied!</span>
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="ml-4 text-gray-300">{id}</span>
        </div>
        <div className="flex items-center space-x-2">
          {isSaving ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-400"></div>
              <span className="text-blue-400 text-xs">Saving...</span>
            </div>
          ) : (
            <span className="text-blue-400 text-xs">
              {documentExists ? "Saved" : "Ready"}
            </span>
          )}
          <button
            onClick={handleShare}
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
