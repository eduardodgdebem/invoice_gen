import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  return (
    <main className="flex justify-center p-4">
      <Link
        href="invoiceGen"
        className="rounded-sm bg-black/10 p-2 font-semibold hover:bg-black/20"
      >
        Generate Invoice
      </Link>
    </main>
  );
}
