import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import GoBack from "./_components/router-back-button";

export default async function Home() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  return (
    <main className="flex justify-center p-4 gap-2">
      <Link
        href="invoiceGen"
        className="btn"
      >
        Generate Descriptive
      </Link>
      <Link
        href="descriptivesList"
        className="btn"
      >
        Manage Descriptives
      </Link>
    </main>
  );
}
