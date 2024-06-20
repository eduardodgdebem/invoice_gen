"use client";

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { invoiceGenUseStore } from "~/app/stores/invoice-gen-store";
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

  const [client, setClient] = useState({
    clientName: "",
    clientAddress: "",
  });

  return (
    <main className="p-2 print:hidden">
      <section className="my-2 max-w-[400px] rounded-md border-[1px] p-2">
        <div className="flex  flex-col">
          <label htmlFor="client-name">Client Name</label>
          <input
            type="text"
            className="input input-sm input-bordered"
            id="client-name"
            name="client-name"
            value={client.clientName}
            onChange={(e) =>
              setClient((oldClient) => ({
                ...oldClient,
                clientName: e.target.value,
              }))
            }
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="client-address">Client Address</label>
          <input
            type="text"
            className="input input-sm input-bordered"
            id="client-address"
            name="client-adress"
            value={client.clientAddress}
            onChange={(e) =>
              setClient((oldClient) => ({
                ...oldClient,
                clientAddress: e.target.value,
              }))
            }
          />
        </div>
      </section>

      <button className="btn btn-primary" onClick={handlePrint}>
        Print
      </button>

      <div ref={componentRef}>
        <InvoicePdf client={client} />
      </div>
    </main>
  );
}

function InvoicePdf({
  client,
}: {
  client?: { clientName: string; clientAddress: string };
}) {
  const itemsSelectedByCategory = invoiceGenUseStore(
    (state) => state.itemsSelectedByCategory,
  );
  const categoriesIds = Object.keys(itemsSelectedByCategory).map((s) =>
    Number(s),
  );

  const getToday = () => {
    const today = new Date();
    return `${today.getMonth()}/${today.getDate()}/${today.getFullYear()}`;
  };

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
          {isClient(client) ? (
            <div>
              <p className="text-gray-400">CLIENT</p>
              <p>{client!.clientName}</p>
              <p className="max-w-[350px] break-words">
                {client!.clientAddress}
              </p>
              {/* <p>Fort Myers, FL 33912</p> */}
            </div>
          ) : null}
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

function isClient(client?: { clientName?: string; clientAddress?: string }) {
  return client && (client.clientName?.length || client.clientAddress?.length);
}
