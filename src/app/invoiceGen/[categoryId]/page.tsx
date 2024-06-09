"use client";

import { InvoiceDescriptionItems } from "@prisma/client";
import { ChangeEvent, useEffect, useState } from "react";
import { AddDescriptionItemButton } from "~/app/_components/add-description-item-button";
import {
  TItemsSelectedByCategory,
  invoiceGenUseStore,
} from "~/app/stores/invoice-gen-store";
import { api } from "~/trpc/react";

export default function InvoiceByCategoryID({
  params,
}: {
  params: { categoryId: string };
}) {
  const categoryId = Number(params.categoryId);
  const category = api.invoice.getCategoryById.useQuery({ categoryId });
  const allItems = api.invoice.getItemsByCategoryId.useQuery({
    categoryId,
  });
  const itemsSelectedByCategory = invoiceGenUseStore(
    (state) => state.itemsSelectedByCategory,
  );

  if (allItems.isFetching) return <p>Loding...</p>;

  if (allItems.data?.length === 0)
    return (
      <section className="p-2">
        <p>No items</p>
        <AddDescriptionItemButton
          categoryId={categoryId}
          onSuccess={() => {
            allItems.refetch();
          }}
        />
      </section>
    );

  return (
    <section className="p-2">
      <div>
        <ul>
          {allItems.data?.map((item) => (
            <li key={item.id}>
              <CheckButton
                item={item}
                categoryId={categoryId}
                itemsSelectedByCategory={itemsSelectedByCategory}
              />
              {item.description}
            </li>
          ))}
        </ul>
        <AddDescriptionItemButton
          categoryId={categoryId}
          onSuccess={() => {
            allItems.refetch();
          }}
        />
      </div>
    </section>
  );
}

function CheckButton({
  item,
  itemsSelectedByCategory,
  categoryId,
}: {
  item: InvoiceDescriptionItems;
  itemsSelectedByCategory: TItemsSelectedByCategory;
  categoryId: number;
}) {
  const updateItem = invoiceGenUseStore((state) => state.updateItem);

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const thisSelectedItems = itemsSelectedByCategory[categoryId];
    if (!thisSelectedItems) return;
    const thisSelectedItemsIds = Object.keys(thisSelectedItems);
    const exist = thisSelectedItemsIds?.includes(item.id.toString());

    setChecked(exist);
  }, [itemsSelectedByCategory]);

  const onInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    item: InvoiceDescriptionItems,
  ) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      updateItem(categoryId, item.id, item.description);
    }
  };

  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onInputChange(e, item)}
    />
  );
}
