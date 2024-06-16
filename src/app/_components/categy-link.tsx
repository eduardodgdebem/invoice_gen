"use client";

import Link from "next/link";

export default function CategoryLink({
  category,
}: {
  category: { id: number; name: string };
}) {
  return (
    <Link href={`/invoiceGen/${category.id}`} key={category.id}>
      <h3 className="p-2 text-2xl font-bold capitalize">{category.name}</h3>
      <hr className="h-[5px] w-full rounded-br-full rounded-tr-full bg-black/20" />
    </Link>
  );
}
