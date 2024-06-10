import Link from "next/link";
import { api } from "~/trpc/server";
import { AddCategoryButton } from "./add-category-button";

export default async function CategoriesList() {
  const allCategories = await api.invoice.getAllCategories();

  return (
    <section>
      {allCategories.map((category) => {
        return (
          <Link href={`/invoiceGen/${category.id}`} key={category.id}>
            <h3 className="p-2 text-2xl font-bold capitalize">
              {category.name}
            </h3>
            <div className="h-[2px] w-full rounded-full bg-black/20" />
          </Link>
        );
      })}

      <AddCategoryButton />
    </section>
  );
}