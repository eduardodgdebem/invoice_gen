import Link from "next/link";
import CategoriesList from "~/app/_components/categories-list";

export default function InvoiceGenLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { categoryId: string };
}) {
  return (
    <main className="flex flex-col justify-between">
      <section className="flex justify-between">
        <CategoriesList currCategoryId={Number(params.categoryId)} />
        {children}
      </section>
      <section className="flex justify-end p-2">
        <Footer />
      </section>
    </main>
  );
}

function Footer() {
  return (
    <div>
      <Link
        href="/invoiceGen/pdf"
        className="btn btn-primary"
      >
        Generate Descriptive
      </Link>
    </div>
  );
}
