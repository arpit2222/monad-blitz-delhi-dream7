"use client";

import dynamic from "next/dynamic";
import { ToastProvider } from "@/components/ui/Toast";

const StadiumBackground = dynamic(() => import("@/components/layout/StadiumBackground"), { ssr: false });
const Navbar = dynamic(() => import("@/components/layout/Navbar"), { ssr: false });

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <StadiumBackground />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        {children}
      </main>
    </ToastProvider>
  );
}
