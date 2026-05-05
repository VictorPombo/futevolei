import { createClient } from "@/lib/supabase/server";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { rpID } from "@/lib/webauthn/config";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { data: passkeys } = await supabase
      .from("passkeys")
      .select("id, transports")
      .eq("user_id", user.id);

    const allowCredentials = (passkeys || []).map(key => ({
      id: key.id,
      type: "public-key" as const,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transports: key.transports as any[],
    }));

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials,
      userVerification: "preferred",
    });

    const response = NextResponse.json(options);
    response.cookies.set("webauthn_auth_challenge", options.challenge, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 5, // 5 min
    });

    return response;
  } catch (error) {
    console.error("Error generating auth options:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
