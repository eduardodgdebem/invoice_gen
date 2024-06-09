import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "~/trpc/react";
import { getServerAuthSession } from "~/server/auth";
import Link from "next/link";

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
      <body className="bg-gray-200">
        <Nav />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}

async function Nav() {
  const session = await getServerAuthSession();

  return (
    <div className="flex justify-between items-center p-2">
      <Link
        href="/"
        className="rounded-sm bg-black/10 p-2 font-semibold hover:bg-black/20"
      >
        Home
      </Link>
      <div className="flex items-center justify-end gap-4">
        <p className="text-center text-lg">
          {session && <span>{session.user?.name}</span>}
        </p>
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="rounded-sm bg-black/10 p-2 font-semibold hover:bg-black/20"
        >
          {session ? "Sign out" : "Sign in"}
        </Link>
      </div>
    </div>
  );
}
