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
      <button
        className="rounded-sm bg-black/10 p-2 text-sm font-semibold hover:bg-black/20"
        onClick={() => setIsAdding(!isAdding)}
      >
        Add category
      </button>
    );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost.mutate({ name });
      }}
      className="flex gap-2 text-sm"
    >
      <input
        type="text"
        placeholder="Title"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-sm p-1 text-black"
      />
      <button
        type="submit"
        className="rounded-sm bg-black/10 p-2 font-semibold transition hover:bg-black/20"
        disabled={createPost.isPending}
      >
        {createPost.isPending ? "Adding..." : "Add"}
      </button>
      <button
        type="button"
        className="flex aspect-square h-5 items-center text-base justify-center rounded-full bg-black/10 p-4 font-semibold transition hover:bg-black/20"
        onClick={() => setIsAdding(false)}
      >
        &#10006;
      </button>
    </form>
  );
}
