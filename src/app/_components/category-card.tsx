import { InvoiceDescriptionCategory } from "@prisma/client";
import { api } from "~/trpc/server";
import { AddDescriptionItemButton } from "./add-description-item-button";

export default async function CategoryCard({
  category,
}: {
  category: InvoiceDescriptionCategory;
}) {
  return (
    <div className="rounded-md bg-white p-4">
      <h3 className="text-lg font-bold capitalize">{category.name}</h3>
      <DescriptionItemsByCategoryID categoryId={category.id} />
    </div>
  );
}

async function DescriptionItemsByCategoryID({
  categoryId,
}: {
  categoryId: number;
}) {
  const allIDI = await api.invoice.getItemsByCategoryId({ categoryId });

  return (
    <div className="w-full max-w-xs">
      <form action="">
        <ul>
          {allIDI &&
            allIDI.map((DI) => {
              return (
                <li key={DI.id} className="flex gap-1 pb-1">
                  <input type="checkbox" name="" id={DI.id.toString()} />
                  {DI.description}
                </li>
              );
            })}
        </ul>
      </form>

      <AddDescriptionItemButton categoryId={categoryId}/>
    </div>
  );
}
