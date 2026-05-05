"use client";

import { useState } from "react";
import { startRegistration } from "@simplewebauthn/browser";

export default function WebAuthnRegister({ isRegistered }: { isRegistered: boolean }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleRegister = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // 1. Pegar options do servidor
      const res = await fetch("/api/auth/webauthn/generate-registration-options");
      if (!res.ok) throw new Error("Erro ao iniciar registro");
      const options = await res.json();

      // 2. Chamar o prompt nativo do navegador/OS (FaceID/TouchID)
      let attResp;
      try {
        attResp = await startRegistration(options);
      } catch (error: unknown) {
        if (error.name === "NotAllowedError") {
          throw new Error("Registro cancelado pelo usuário.");
        }
        throw error;
      }

      // 3. Enviar resposta para validação
      const verificationResp = await fetch("/api/auth/webauthn/verify-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attResp),
      });

      const verificationJSON = await verificationResp.json();

      if (verificationJSON.verified) {
        setMessage({ type: "success", text: "Aparelho registrado com sucesso!" });
      } else {
        setMessage({ type: "error", text: verificationJSON.error || "Falha ao verificar." });
      }
    } catch (error: unknown) {
      console.error(error);
      setMessage({ type: "error", text: error.message || "Erro inesperado." });
    } finally {
      setLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="rounded-xl p-6" style={{ background: "var(--color-card)", border: "1px solid var(--color-success-bg)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500/10 text-green-500">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
          </div>
          <div>
            <h3 className="font-bold text-sm text-green-500">Identidade Verificada</h3>
            <p className="text-xs text-text-secondary mt-0.5">Seu dispositivo está cadastrado como chave de segurança.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-6" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            Segurança <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-500">Pendente</span>
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            Cadastre seu aparelho (FaceID/TouchID) para fazer check-in nas partidas rapidamente.
          </p>
        </div>

        {message && (
          <div className="p-3 rounded-lg text-sm" style={{ background: message.type === "success" ? "var(--color-success-bg)" : "var(--color-error-bg)", color: message.type === "success" ? "var(--color-success)" : "var(--color-error)" }}>
            {message.text}
          </div>
        )}

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
          style={{ background: "var(--color-primary)", color: "var(--color-bg)" }}
        >
          {loading ? "Aguardando..." : "Cadastrar Biometria"}
        </button>
      </div>
    </div>
  );
}
