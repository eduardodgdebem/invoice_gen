import Link from "next/link";
import CategoriesList from "~/app/_components/categories-list";
import ClearDescriptive from "~/app/_components/remove-descriptive-button";

export default function InvoiceGenLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { categoryId: string };
}) {
  return (
    <main className="flex h-[calc(100vh-130px)] flex-col justify-between overflow-y-auto">
      <section className="flex justify-between">
        <CategoriesList currCategoryId={Number(params.categoryId)} />
        {children}
      </section>
      <section className="absolute bottom-0 left-0 flex w-full justify-end border-t-[1px] bg-[var(--fallback-b1,oklch(var(--b1)/1))] p-2">
        <Footer />
      </section>
    </main>
  );
}

function Footer() {
  return (
    <div className="flex gap-2">
      <ClearDescriptive />
      <Link href="/invoiceGen/pdf" className="btn btn-primary">
        Generate Descriptive{" "}
        <svg
          className="h-6 w-6 fill-current md:h-8 md:w-8"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
        </svg>
      </Link>
    </div>
  );
}
