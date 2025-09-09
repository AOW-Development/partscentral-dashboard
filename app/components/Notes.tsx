import React from "react";

interface Note {
  id: string | number;
  message: string;
  timestamp: string | number | Date;
  actor?: string;
}

interface NotesProps {
  title: string;
  noteInput: string;
  setNoteInput: (val: string) => void;
  handleAddNote: () => void;
  notes: Note[];
  formatDay: (timestamp: any) => string;
  formatTime: (timestamp: any) => string;
}

const Notes: React.FC<NotesProps> = ({
  title,
  noteInput,
  setNoteInput,
  handleAddNote,
  notes,
  formatDay,
  formatTime,
}) => {
  return (
    <div className="bg-[#0a1929] rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white text-lg font-semibold">{title}</h3>
      </div>
      <div className="flex flex-row items-start md:items-center gap-2 mb-3">
        <input
          className="flex-1 bg-[#0f1e35] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none"
          placeholder="Notes"
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddNote();
            }
          }}
        />
        <button
          onClick={handleAddNote}
          className="bg-[#006BA9] hover:bg-[#006BA9]/90 text-white px-4 py-2 rounded-lg cursor-pointer"
        >
          Add
        </button>
      </div>
      <div className="max-h-80 overflow-auto pr-1 space-y-3">
        {notes.length === 0 && (
          <p className="text-white/60 text-sm">No notes yet</p>
        )}
        {notes.map((n) => (
          <div key={n.id} className="text-sm">
            <div className="text-white/80">{n.message}</div>
            <div className="text-white/40 text-xs">
              {formatDay(n.timestamp)} {formatTime(n.timestamp)}
              {n.actor ? `  |  ${n.actor}` : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
