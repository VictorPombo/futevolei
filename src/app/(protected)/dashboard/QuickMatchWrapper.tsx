"use client";

import { useState } from "react";
import QuickMatchModal from "./QuickMatchModal";

export default function QuickMatchWrapper({ currentUser }: { currentUser: { id: string; name: string } }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg transition-transform hover:scale-110 z-40"
        style={{ background: "var(--color-primary)", color: "var(--color-bg)", boxShadow: "0 4px 20px rgba(245,158,11,0.4)" }}
        title="Registrar Partida Avulsa"
      >
        +
      </button>

      <QuickMatchModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        currentUser={currentUser}
      />
    </>
  );
}
