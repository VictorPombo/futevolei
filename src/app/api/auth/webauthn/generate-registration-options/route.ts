import { createClient } from "@/lib/supabase/server";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { rpID, rpName } from "@/lib/webauthn/config";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { data: userData } = await supabase
      .from("users")
      .select("name, email")
      .eq("id", user.id)
      .single();

    // Em um app real, buscaríamos as credenciais já existentes deste usuário
    // do banco de dados para evitar registro duplicado do mesmo aparelho.
    const { data: existingKeys } = await supabase
      .from("passkeys")
      .select("id")
      .eq("user_id", user.id);

    const excludeCredentials = (existingKeys || []).map(key => ({
      id: key.id, // O ID salvo no banco já é uma string (base64url)
      type: "public-key" as const,
    }));

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: new TextEncoder().encode(user.id),
      userName: userData?.email || user.email || "user",
      userDisplayName: userData?.name || "Usuário",
      attestationType: "none",
      excludeCredentials,
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
        authenticatorAttachment: "platform", // Força uso do FaceID/TouchID integrado
      },
    });

    // Guardar a challenge na sessão do usuário ou cache para validação posterior
    // Como Supabase Auth usa cookies, vamos criar um cookie apenas pro challenge WebAuthn
    const response = NextResponse.json(options);
    response.cookies.set("webauthn_challenge", options.challenge, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 5, // 5 min
    });

    return response;
  } catch (error) {
    console.error("Error generating registration options:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
