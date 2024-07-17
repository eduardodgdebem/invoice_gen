"use client";

import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { descriptiveUseStore } from "~/app/stores/invoice-gen-store";
import { api } from "~/trpc/react";
import Image from "next/image";

export default function InvoiceGenPdf() {
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => {
      if (!componentRef?.current) return null;
      return componentRef.current;
    },
  });

  const client = descriptiveUseStore((state) => state.client);
  const updateClient = descriptiveUseStore((state) => state.updateClient);
  const title = descriptiveUseStore((state) => state.title);
  const updateTitle = descriptiveUseStore((state) => state.updateTitle);

  return (
    <main className="flex h-[calc(100vh-130px)] flex-col gap-2 overflow-y-auto p-2 print:hidden ">
      <section className="flex w-full gap-2 rounded-md border-[1px] p-2">
        <div className="w-full">
          <div className="flex flex-col">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              className="input input-sm input-bordered"
              id="title"
              name="title"
              value={title}
              onChange={
                (e) => updateTitle(e.target.value)
                // setClient((oldClient) => ({
                //   ...oldClient,
                //   clientName: e.target.value,
                // }))
              }
            />
          </div>
        </div>
        <div className="w-full">
          <div className="flex  flex-col">
            <label htmlFor="client-name">Client Name</label>
            <input
              type="text"
              className="input input-sm input-bordered"
              id="client-name"
              name="client-name"
              value={client.name}
              onChange={(e) => updateClient({ name: e.target.value })}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="client-address">Client Address</label>
            <input
              type="text"
              className="input input-sm input-bordered"
              id="client-address"
              name="client-adress"
              value={client.address}
              onChange={(e) => updateClient({ address: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section ref={componentRef} className="rounded-md border-[1px]">
        <InvoicePdf />
      </section>

      <section className="absolute bottom-0 left-0 w-full bg-[var(--fallback-b1,oklch(var(--b1)/1))]">
        <hr />
        <div className="m-2 flex justify-end gap-2">
          <button className="btn btn-primary" onClick={handlePrint}>
            Print
          </button>
          <SaveButton />
        </div>
      </section>
    </main>
  );
}

function InvoicePdf() {
  const client = descriptiveUseStore((state) => state.client);

  const itemsSelectedByCategory = descriptiveUseStore(
    (state) => state.descriptive,
  );
  const categoriesIds = Object.keys(itemsSelectedByCategory).map((s) =>
    Number(s),
  );

  const getToday = () => {
    const today = new Date();
    return `${today.getMonth()}/${today.getDate()}/${today.getFullYear()}`;
  };

  useEffect(() => {
    console.log(itemsSelectedByCategory);
  }, [itemsSelectedByCategory]);

  return (
    <div className="bg-white px-8 py-10 text-black print:font-roboto">
      <header className="flex justify-between">
        <Image
          src="/abq-logo.png"
          alt="logo"
          height={100}
          width={150}
          className="w-100 h-100"
        />

        <div className="text-xs">
          <h2 className="text-base font-bold">
            ABQ Painting & Remodeling // Israel
          </h2>
          <p>12995 S Tamiami Trail, Suite 7</p>
          <p>Fort Myers, FL 33907 US</p>
          <p>office@abqremodel.com</p>
        </div>
      </header>

      <section className="mt-8">
        <h2 className="text-xl text-blue-900">DESCRIPTION</h2>
        <div className="flex justify-between text-sm">
          {!!(client && (client.name?.length || client.address?.length)) && (
            <div>
              <p className="text-gray-400">CLIENT</p>
              <p>{client.name}</p>
              <p className="max-w-[350px] break-words">{client.address}</p>
            </div>
          )}
          <div>
            <div className="flex justify-between gap-4">
              <p className="text-gray-400">DATE</p>
              <p>{getToday()}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 flex flex-col gap-4">
        <hr />
        {categoriesIds.map((categoryId) => {
          const values = Object.values(itemsSelectedByCategory[categoryId]!);
          if (!(values.length > 0)) return;

          return (
            <CategoryCard
              categoryId={categoryId}
              categoryItems={itemsSelectedByCategory[categoryId]!}
              key={categoryId}
            />
          );
        })}
      </section>
    </div>
  );
}

function CategoryCard({
  categoryId,
  categoryItems,
}: {
  categoryId: number;
  categoryItems: Record<string, { description: string; note?: string }>;
}) {
  const category = api.invoice.getCategoryById.useQuery({ categoryId });

  return (
    <section>
      <h3 className="text-2xl font-bold capitalize">{category.data?.name}:</h3>
      <ItemsList categoryItems={categoryItems} />
    </section>
  );
}

function ItemsList({
  categoryItems,
}: {
  categoryItems: Record<string, { description: string; note?: string }>;
}) {
  const categoryItemsKeys = Object.keys(categoryItems);
  return (
    <ul>
      {categoryItemsKeys.map((itemKey) => (
        <li key={itemKey}>
          - {categoryItems[itemKey]?.description}{" "}
          {categoryItems[itemKey]?.note?.length &&
            "-" + categoryItems[itemKey]?.note}
        </li>
      ))}
    </ul>
  );
}

function SaveButton() {
  const client = descriptiveUseStore((state) => state.client);
  const title = descriptiveUseStore((state) => state.title);
  const descriptive = descriptiveUseStore((state) => state.descriptive);
  const descriptiveId = descriptiveUseStore((state) => state.descriptiveId);
  const updateDescriptiveId = descriptiveUseStore(
    (state) => state.updateDescriptiveId,
  );
  const saveDescriptive = api.descriptive.addDescriptive.useMutation();
  const updateDescriptive = api.descriptive.updateDescriptive.useMutation();

  const handleSave = () => {
    if (descriptiveId) {
      updateDescriptive.mutate(
        {
          clientName: client.name,
          clientAddress: client.address,
          title,
          json: descriptive,
          id: descriptiveId,
        },
        {
          onSuccess: (data) => {
            if (data.id) {
              updateDescriptiveId(data.id);
            }
          },
        },
      );

      return;
    }

    saveDescriptive.mutate(
      {
        clientName: client.name,
        clientAddress: client.address,
        title,
        json: descriptive,
      },
      {
        onSuccess: (data) => {
          if (data.id) {
            updateDescriptiveId(data.id);
          }
        },
      },
    );
  };

  return (
    <button className="btn btn-primary" onClick={handleSave}>
      {saveDescriptive.isPending ? (
        <span className="loading loading-spinner"></span>
      ) : (
        "Save"
      )}
    </button>
  );
}
