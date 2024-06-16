import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  return (
    <main className="flex justify-center p-4">
      <Link
        href="invoiceGen"
        className="btn"
      >
        Generate Invoice
      </Link>
    </main>
  );
}
