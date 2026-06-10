"use client";
import { useState } from "react";

export default function ShortcutHints() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Keyboard shortcuts"
        className="fixed bottom-6 right-16 p-2 rounded bg-atlas-bg-tertiary text-sm shadow"
      >
        ?
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-atlas-bg-card p-6 rounded shadow-lg max-w-md">
            <h2 className="font-bold mb-4">Keyboard Shortcuts</h2>
            <ul className="space-y-2 text-sm">
              <li><kbd>/</kbd> Focus search</li>
              <li><kbd>J</kbd> Move down</li>
              <li><kbd>K</kbd> Move up</li>
              <li><kbd>Enter</kbd> Open selected model</li>
              <li><kbd>Esc</kbd> Clear search / close modal</li>
              <li><kbd>⌘K / Ctrl+K</kbd> Open command palette</li>
            </ul>
            <button
              onClick={() => setOpen(false)}
              className="mt-4 px-3 py-1 rounded bg-atlas-green text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
