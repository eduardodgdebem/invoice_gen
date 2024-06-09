import { getServerAuthSession } from "~/server/auth";
import CategoriesList from "../_components/categories-list";

export default async function Invoice() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  return (
    <main>
      <CategoriesList />
    </main>
  );
}