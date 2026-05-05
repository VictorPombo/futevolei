import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { rpID, origin } from "@/lib/webauthn/config";
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
    const challengeCookie = request.cookies.get("webauthn_challenge")?.value;

    if (!challengeCookie) {
      return NextResponse.json({ error: "Challenge expirado ou ausente" }, { status: 400 });
    }

    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge: challengeCookie,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    if (verification.verified && verification.registrationInfo) {
      const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;

      // Base64URL do credentialID
      const credentialIDStr = body.id;
      
      // Armazenar no banco via admin (system)
      await admin.from("passkeys").insert({
        id: credentialIDStr,
        user_id: user.id,
        public_key: Buffer.from(credential.publicKey).toString('base64'),
        counter: credential.counter,
        device_type: credentialDeviceType,
        backed_up: credentialBackedUp,
        transports: body.response.transports || [],
      });

      // Atualizar o perfil do atleta indicando que tem biometria cadastrada
      await admin.from("athlete_profiles").update({
        biometrics_registered: true
      }).eq("user_id", user.id);

      const response = NextResponse.json({ verified: true });
      response.cookies.delete("webauthn_challenge");
      return response;
    }

    return NextResponse.json({ verified: false }, { status: 400 });
  } catch (error: unknown) {
    console.error("Error verifying registration:", error);
    return NextResponse.json({ error: (error as Error).message || "Erro interno" }, { status: 500 });
  }
}
