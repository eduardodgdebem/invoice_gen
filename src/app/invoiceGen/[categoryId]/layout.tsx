import Link from "next/link";
import CategoriesList from "~/app/_components/categories-list";

export default function InvoiceGenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-[calc(100svh-56px)] flex-col justify-between">
      <section className="flex">
        <CategoriesList />
        {children}
      </section>
      <section className="flex justify-end">
        <Footer />
      </section>
    </main>
  );
}

function Footer() {
  return (
    <div className="p-2">
      <Link
        href="/invoiceGen/pdf"
        className="rounded-sm bg-black/10 p-2 font-semibold hover:bg-black/20"
      >
        Generate invoice
      </Link>
    </div>
  );
}
