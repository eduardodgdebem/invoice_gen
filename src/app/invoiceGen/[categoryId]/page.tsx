"use client";

import type { ServiceItems } from "@prisma/client";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { AddDescriptionItemButton } from "~/app/_components/add-description-item-button";
import type { TDescriptive } from "~/app/stores/invoice-gen-store";
import { invoiceGenUseStore } from "~/app/stores/invoice-gen-store";
import { api } from "~/trpc/react";

export default function InvoiceByCategoryID({
  params,
}: {
  params: { categoryId: string };
}) {
  const categoryId = Number(params.categoryId);
  const allItems = api.invoice.getItemsByCategoryId.useQuery({
    categoryId,
  });
  const itemsSelectedByCategory = invoiceGenUseStore(
    (state) => state.descriptive,
  );

  if (allItems.isFetching) return <p>Loding...</p>;

  if (allItems.data?.length === 0)
    return (
      <section className="p-2">
        <p>No items</p>
        <AddDescriptionItemButton
          categoryId={categoryId}
          onSuccess={() => {
            allItems.refetch().catch(console.error);
          }}
        />
      </section>
    );

  return (
    <section className="w-full p-2">
      <div className="flex flex-col gap-2">
        <ul>
          {allItems.data?.map((item) => (
            <ServiceItem
              key={item.id}
              item={item}
              categoryId={categoryId}
              itemsSelectedByCategory={itemsSelectedByCategory}
            />
          ))}
        </ul>
        <AddDescriptionItemButton
          categoryId={categoryId}
          onSuccess={() => {
            allItems.refetch().catch(console.error);
          }}
        />
      </div>
    </section>
  );
}

function ServiceItem({
  item,
  categoryId,
  itemsSelectedByCategory,
}: {
  item: ServiceItems;
  categoryId: number;
  itemsSelectedByCategory: TDescriptive;
}) {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [checked, setChecked] = useState(false);

  const updateNote = invoiceGenUseStore((state) => state.updateNote);

  const onSaveNote = (input: string) => {
    updateNote(categoryId, item.id, input);
    setIsAddingNote(false);
  };

  useEffect(() => {
    if(!checked && isAddingNote) setIsAddingNote(false)
  }, [isAddingNote, checked])

  return (
    <>
      <li className="p-1 text-xl">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <CheckButton
              item={item}
              categoryId={categoryId}
              itemsSelectedByCategory={itemsSelectedByCategory}
              checked={checked}
              setChecked={setChecked}
            />
            {item.description}
          </div>

          {!isAddingNote ? (
            <button
              className="btn btn-sm"
              onClick={() => {
                setIsAddingNote(true);
              }}
              disabled={!checked}
            >
              Add Note
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-circle btn-sm"
              onClick={() => setIsAddingNote(false)}
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
          )}
        </div>

        {isAddingNote && (
          <AddNoteForm
            onSubmit={onSaveNote}
            prevNote={itemsSelectedByCategory[categoryId]?.[item.id]?.note}
          />
        )}
        {itemsSelectedByCategory[categoryId]?.[item.id]?.note &&
          !isAddingNote &&
          "Note: " + itemsSelectedByCategory[categoryId]?.[item.id]?.note}
      </li>
      <hr className="h-[3px] w-full rounded-full bg-black/20" />
    </>
  );
}

function CheckButton({
  item,
  itemsSelectedByCategory,
  categoryId,
  checked,
  setChecked
}: {
  item: ServiceItems;
  itemsSelectedByCategory: TDescriptive;
  categoryId: number;
  checked: boolean;
  setChecked: Dispatch<SetStateAction<boolean>>
}) {
  const updateItem = invoiceGenUseStore((state) => state.updateItem);
  const removeItem = invoiceGenUseStore((state) => state.removeItem);

  useEffect(() => {
    const thisSelectedItems = itemsSelectedByCategory[categoryId];
    if (!thisSelectedItems) return;
    const thisSelectedItemsIds = Object.keys(thisSelectedItems);
    const exist = thisSelectedItemsIds?.includes(item.id.toString());

    setChecked(exist);
  }, [itemsSelectedByCategory]);

  const onInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    item: ServiceItems,
  ) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      updateItem(categoryId, item.id, item.description);
    } else {
      removeItem(categoryId, item.id);
    }
    setChecked(isChecked);
  };

  return (
    <div className="flex gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onInputChange(e, item)}
        className="checkbox-primary checkbox"
      />
    </div>
  );
}

function AddNoteForm({
  onSubmit,
  prevNote,
}: {
  onSubmit: (input: string) => void;
  prevNote?: string;
}) {
  const [input, setInput] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(input);
        setInput("");
      }}
      className="flex gap-2 mt-2"
    >
      <textarea
        className="textarea textarea-bordered w-full"
        placeholder={prevNote?.length ? prevNote : "Note"}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="btn btn-primary">Save</button>
    </form>
  );
}
