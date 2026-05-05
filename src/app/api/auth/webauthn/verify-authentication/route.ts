import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { rpID, origin, base64urlToUint8Array } from "@/lib/webauthn/config";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const admin = createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const challengeCookie = request.cookies.get("webauthn_auth_challenge")?.value;

    if (!challengeCookie) {
      return NextResponse.json({ error: "Challenge expirado ou ausente" }, { status: 400 });
    }

    // O corpo inclui o ID da credencial que foi usada
    const { data: passkey } = await admin
      .from("passkeys")
      .select("*")
      .eq("id", body.id)
      .eq("user_id", user.id)
      .single();

    if (!passkey) {
      return NextResponse.json({ error: "Credencial não encontrada ou não pertence ao usuário" }, { status: 400 });
    }

    const verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge: challengeCookie,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        publicKey: base64urlToUint8Array(passkey.public_key) as any,
        id: passkey.id,
        counter: Number(passkey.counter),
        transports: passkey.transports,
      },
    });

    if (verification.verified) {
      const { newCounter } = verification.authenticationInfo;

      // Atualizar counter
      await admin.from("passkeys").update({ counter: newCounter }).eq("id", passkey.id);

      // Se passou um match_id no body, registrar o check-in na partida
      if (body.clientExtensionResults?.match_id || body.match_id) {
        const matchId = body.match_id || body.clientExtensionResults?.match_id;
        
        await admin.from("match_checkins").upsert({
          match_id: matchId,
          user_id: user.id,
          verified_at: new Date().toISOString()
        }, { onConflict: 'match_id,user_id' });
      }

      const response = NextResponse.json({ verified: true });
      response.cookies.delete("webauthn_auth_challenge");
      return response;
    }

    return NextResponse.json({ verified: false }, { status: 400 });
  } catch (error: unknown) {
    console.error("Error verifying authentication:", error);
    return NextResponse.json({ error: (error as Error).message || "Erro interno" }, { status: 500 });
  }
}
