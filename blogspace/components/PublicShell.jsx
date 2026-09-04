"use client";

import { Suspense } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PublicShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<div className="h-16" />}>
        <Navbar />
      </Suspense>

      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}