"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function AddDescriptionItemButton({
  categoryId,
  onSuccess: callback,
}: {
  categoryId: number;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const createPost = api.invoice.addDescriptionByCategory.useMutation({
    onSuccess: () => {
      router.refresh();
      setDescription("");
      setIsAdding(false);
      if (callback) callback();
    },
  });

  if (!isAdding)
    return (
      <button
        className="btn"
        onClick={() => setIsAdding(!isAdding)}
      >
        Add item
      </button>
    );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost.mutate({ description, categoryId });
      }}
      className="flex gap-2 text-sm"
    >
      <input
        type="text"
        placeholder="Title"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="input input-bordered w-full"
      />
      <button
        type="submit"
        className="btn"
        disabled={createPost.isPending}
      >
        {createPost.isPending ? "Adding..." : "Add"}
      </button>
      <button
        type="button"
        className="btn btn-circle"
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
    </form>
  );
}
