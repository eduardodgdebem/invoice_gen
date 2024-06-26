"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function AddCategoryButton({
  onSuccess: callback,
}: {
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const createPost = api.invoice.addCategory.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
      setIsAdding(false);
      if (callback) callback();
    },
  });

  if (!isAdding)
    return (
      <button className="btn" onClick={() => setIsAdding(!isAdding)}>
        Add category
      </button>
    );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost.mutate({ name });
      }}
      className="flex flex-col items-end gap-2 text-sm"
    >
      <input
        type="text"
        placeholder="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input input-bordered w-full"
      />
      <div className="flex gap-1">
        <button
          type="submit"
          className="btn btn-sm"
          disabled={createPost.isPending}
        >
          {createPost.isPending ? "Adding..." : "Add"}
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
