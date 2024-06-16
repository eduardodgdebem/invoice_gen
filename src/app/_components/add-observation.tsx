"use client";

import { useState } from "react";

export function AddObservation({onAddCB}: {onAddCB?: () => void}) {
 
  const [description, setDescription] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  if (!isAdding)
    return (
      <button
        className="btn btn-sm"
        onClick={() => {  
          setIsAdding(!isAdding)
          if(onAddCB) onAddCB()
        }}
      >
        Add Note
      </button>
    );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="flex gap-2 text-sm flex-col"
    >
      <input
        type="text"
        placeholder="Title"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="input input-bordered w-full"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="btn btn-sm"
        
        >
          Add
        </button>
        <button
          type="button"
          className="btn btn-circle btn-sm"
          onClick={() => setIsAdding(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}
