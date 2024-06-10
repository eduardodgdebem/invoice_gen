"use client";

import { useRef } from "react";
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

  return (
    <main className="p-2">
      <button
        className="rounded-sm bg-black/10 p-2 font-semibold hover:bg-black/20"
        onClick={handlePrint}
      >
        Print
      </button>

      <div ref={componentRef}>
        <InvoicePdf />
      </div>
    </main>
  );
}

function InvoicePdf() {
  const itemsSelectedByCategory = invoiceGenUseStore(
    (state) => state.itemsSelectedByCategory,
  );
  const categoriesIds = Object.keys(itemsSelectedByCategory).map((s) =>
    Number(s),
  );

  return (
    <div className="bg-white px-8 py-10">
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

      <section>
        <h2 className="text-blue-900 text-2xl">INVOICE</h2>
        <div className="flex justify-between">
          <div>
            <p className="text-gray-400">BILL TO</p>
            <p>Ana Albuquerque</p>
            <p>7568 Cameron Cir</p>
            <p>Fort Myers, FL 33912</p>
          </div>
          <div>
            <div className="flex justify-between gap-4">
              <p className="text-gray-400">INVOICE</p>
              <p>1127</p>
            </div>
            <div className="flex justify-between gap-4">
              <p className="text-gray-400">DATE</p>
              <p>05/21/2024</p>
            </div>
            <div className="flex justify-between gap-4">
              <p className="text-gray-400">TERMS</p>
              <p>Due on receipt</p>
            </div>
            <div className="flex justify-between gap-4">
              <p className="text-gray-400">DUE DATE</p>
              <p>05/21/2024</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <header></header>
        {categoriesIds.map((categoryId) => {
          const values = Object.values(
            itemsSelectedByCategory[categoryId]!
          );
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
  categoryItems: Record<string, string>;
}) {
  const category = api.invoice.getCategoryById.useQuery({ categoryId });

  return (
    <section>
      <h3 className="font-bold capitalize">{category.data?.name}</h3>
      <ItemsList categoryItems={categoryItems} />
    </section>
  );
}

function ItemsList({
  categoryItems,
}: {
  categoryItems: Record<string, string>;
}) {
  const categoryItemsKeys = Object.keys(categoryItems);
  return (
    <ul>
      {categoryItemsKeys.map((itemKey) => (
        <li key={itemKey}>{categoryItems[itemKey]}</li>
      ))}
    </ul>
  );
}
