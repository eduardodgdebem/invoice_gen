import Link from "next/link";
import { api } from "~/trpc/server";
import { AddCategoryButton } from "./add-category-button";

export default async function CategoriesList() {
  const allCategories = await api.invoice.getAllCategories();

  return (
    <section>
      {allCategories.map((categoty) => {
        return (
          <Link href={`/invoiceGen/${categoty.id}`}>
            <h3 className="p-2 text-2xl font-bold capitalize">
              {categoty.name}
            </h3>
            <div className="h-[2px] w-full rounded-full bg-black/20" />
          </Link>
        );
      })}

      <AddCategoryButton />
    </section>
  );
}