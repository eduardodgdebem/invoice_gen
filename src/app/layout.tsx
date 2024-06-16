import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "~/trpc/react";
import { getServerAuthSession } from "~/server/auth";
import Link from "next/link";
import ThemeControler from "./_components/theme-controle";

export const metadata = {
  title: "invoice gen",
  description: "invoice generator",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="">
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
      <Link href="/" className="btn btn-primary">
        Home
      </Link>
      <div className="flex items-center justify-end gap-4">
        <p className="text-center text-lg">
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
