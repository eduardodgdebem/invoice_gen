import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "~/trpc/react";
import { getServerAuthSession } from "~/server/auth";
import Link from "next/link";
import ThemeControler from "./_components/theme-controle";
import GoBack from "./_components/router-back-button";

export const metadata = {
  title: "descriptive gen",
  description: "descriptive generator",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Nav />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}

async function Nav() {
  const session = await getServerAuthSession();

  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex gap-2">
        <GoBack/>
        <Link href="/" className="btn btn-primary">
          Home
        </Link>
      </div>
      <div className="flex items-center justify-end gap-4">
        <p className="text-center text-lg max-sm:hidden">
          {session && <span>{session.user?.name}</span>}
        </p>
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="btn"
        >
          {session ? "Sign out" : "Sign in"}
        </Link>
        <ThemeControler />
      </div>
    </div>
  );
}
