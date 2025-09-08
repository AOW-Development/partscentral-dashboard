"use client";

import { useState, useEffect } from "react";
import { useNotesStore } from "@/store/notesStore";
import { format } from "date-fns";

const NotesSystem = () => {
  // Get notes state and actions from the store
  const {
    customerNotes,
    yardNotes,
    customerNoteInput,
    yardNoteInput,
    setCustomerNoteInput,
    setYardNoteInput,
    addCustomerNote,
    addYardNote,
    clearCustomerNoteInput,
    clearYardNoteInput,
  } = useNotesStore();

  // Handle customer note submission
  const handleCustomerNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerNoteInput.trim()) return;
    
    addCustomerNote(customerNoteInput.trim(), "By Agent");
    clearCustomerNoteInput();
  };

  // Handle yard note submission
  const handleYardNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!yardNoteInput.trim()) return;
    
    addYardNote(yardNoteInput.trim(), "By Agent");
    clearYardNoteInput();
  };

  // Auto-resize textarea based on content
  useEffect(() => {
    const adjustTextarea = (id: string) => {
      const textarea = document.getElementById(id) as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
      }
    };

    adjustTextarea('customer-note-input');
    adjustTextarea('yard-note-input');
  }, [customerNoteInput, yardNoteInput]);

  return (
    <div className="space-y-6">
      {/* Customer Notes Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-3">Customer Notes</h3>
        
        {/* Note Input */}
        <form onSubmit={handleCustomerNoteSubmit} className="mb-4">
          <div className="flex gap-2">
            <textarea
              id="customer-note-input"
              value={customerNoteInput}
              onChange={(e) => setCustomerNoteInput(e.target.value)}
              placeholder="Add a note for the customer..."
              className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={1}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
        </form>

        {/* Notes List */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {customerNotes.map((note) => (
            <div key={note.id} className="p-2 bg-gray-50 rounded border-l-4 border-blue-500">
              <div className="flex justify-between text-sm text-gray-500">
                <span>{note.actor || 'System'}</span>
                <span>{format(new Date(note.timestamp), 'MMM d, yyyy h:mm a')}</span>
              </div>
              <p className="mt-1 text-gray-800">{note.message}</p>
            </div>
          ))}
          {customerNotes.length === 0 && (
            <p className="text-gray-500 text-center py-4">No customer notes yet</p>
          )}
        </div>
      </div>

      {/* Yard Notes Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-3">Yard Notes</h3>
        
        {/* Note Input */}
        <form onSubmit={handleYardNoteSubmit} className="mb-4">
          <div className="flex gap-2">
            <textarea
              id="yard-note-input"
              value={yardNoteInput}
              onChange={(e) => setYardNoteInput(e.target.value)}
              placeholder="Add a note for the yard..."
              className="flex-1 p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={1}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Add
            </button>
          </div>
        </form>

        {/* Notes List */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {yardNotes.map((note) => (
            <div key={note.id} className="p-2 bg-gray-50 rounded border-l-4 border-green-500">
              <div className="flex justify-between text-sm text-gray-500">
                <span>{note.actor || 'System'}</span>
                <span>{format(new Date(note.timestamp), 'MMM d, yyyy h:mm a')}</span>
              </div>
              <p className="mt-1 text-gray-800">{note.message}</p>
            </div>
          ))}
          {yardNotes.length === 0 && (
            <p className="text-gray-500 text-center py-4">No yard notes yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesSystem;
