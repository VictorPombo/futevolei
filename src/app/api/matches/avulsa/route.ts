import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const createFriendlyMatchSchema = z.object({
  athlete1Team1Id: z.string().uuid(),
  athlete2Team1Id: z.string().uuid(),
  athlete1Team2Id: z.string().uuid(),
  athlete2Team2Id: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const admin = createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const result = createFriendlyMatchSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Dados de atletas inválidos" },
        { status: 400 }
      );
    }

    const {
      athlete1Team1Id,
      athlete2Team1Id,
      athlete1Team2Id,
      athlete2Team2Id,
    } = result.data;

    // Verificar se os 4 são únicos
    const uniqueAthletes = new Set([
      athlete1Team1Id,
      athlete2Team1Id,
      athlete1Team2Id,
      athlete2Team2Id,
    ]);

    if (uniqueAthletes.size !== 4) {
      return NextResponse.json(
        { error: "A partida precisa de 4 atletas distintos" },
        { status: 400 }
      );
    }

    // Criar as duas duplas (sem campeonato associado)
    const { data: team1, error: errorTeam1 } = await admin.from("teams").insert({
      athlete1_id: athlete1Team1Id,
      athlete2_id: athlete2Team1Id,
    }).select().single();

    if (errorTeam1 || !team1) throw new Error("Erro ao criar dupla 1");

    const { data: team2, error: errorTeam2 } = await admin.from("teams").insert({
      athlete1_id: athlete1Team2Id,
      athlete2_id: athlete2Team2Id,
    }).select().single();

    if (errorTeam2 || !team2) throw new Error("Erro ao criar dupla 2");

    // Criar a partida
    const { data: match, error: errorMatch } = await admin.from("matches").insert({
      team1_id: team1.id,
      team2_id: team2.id,
      stage: "group",
      elo_processed: false,
    }).select().single();

    if (errorMatch || !match) throw new Error("Erro ao criar partida");

    return NextResponse.json({ success: true, match });
  } catch (error: unknown) {
    console.error("Error creating friendly match:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar partida avulsa" },
      { status: 500 }
    );
  }
}
