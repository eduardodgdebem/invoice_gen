"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { AddCategoryButton } from "./add-category-button";

export default function CategoriesList({
  currCategoryId,
}: {
  currCategoryId?: number;
}) {
  const allCategories = api.invoice.getAllCategories.useQuery();

  return (
    <section className="min-w-40 flex flex-col gap-2 p-2">
      {allCategories.data?.map((category) => {
        return (
          <div
            key={category.id}
            className={
              "btn btn-outline h-fit" +
              (currCategoryId === category.id ? " btn-active" : "")
            }
          >
            <Link href={`/invoiceGen/${category.id}`}>
              <h3 className="p-2 text-2xl font-bold capitalize">
                {category.name}
              </h3>
            </Link>
          </div>
        );
      })}

      
        <AddCategoryButton onSuccess={allCategories.refetch}/>
      
    </section>
  );
}
