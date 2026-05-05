import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { processMatch, getLevelForRating } from '../src/lib/elo';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const MOCK_USERS = [
  { name: "Lucas Torres", city: "São Paulo", state: "SP" },
  { name: "Mariana Freitas", city: "Rio de Janeiro", state: "RJ" },
  { name: "Rafael Souza", city: "Belo Horizonte", state: "MG" },
  { name: "Ana Costa", city: "Fortaleza", state: "CE" },
  { name: "Pedro Oliveira", city: "Curitiba", state: "PR" },
  { name: "Beatriz Nunes", city: "Salvador", state: "BA" },
  { name: "Thiago Mendes", city: "São Paulo", state: "SP" },
  { name: "Camila Lima", city: "Florianópolis", state: "SC" },
  { name: "Gabriel Rocha", city: "Recife", state: "PE" },
  { name: "Júlia Santos", city: "Porto Alegre", state: "RS" },
  { name: "Diego Alves", city: "Manaus", state: "AM" },
  { name: "Larissa Dias", city: "Belém", state: "PA" },
  { name: "Bruno Carvalho", city: "Goiânia", state: "GO" },
  { name: "Carolina Silva", city: "Vitória", state: "ES" },
  { name: "Marcelo Cunha", city: "Natal", state: "RN" },
];

async function runSeed() {
  console.log("🌱 Starting Seed...");

  // 1. Create Organizer
  const { data: organizer, error: orgErr } = await supabase.from('users').insert({
    email: `organizer_${uuidv4().substring(0, 8)}@test.com`,
    name: "Organizador Master",
    city: "São Paulo",
    state: "SP",
    role: "organizer"
  }).select().single();

  if (orgErr) throw orgErr;
  console.log("✅ Organizer created:", organizer.name);

  // 2. Create Athletes
  const athletes = [];
  for (const mock of MOCK_USERS) {
    const { data: user, error: userErr } = await supabase.from('users').insert({
      email: `${mock.name.replace(' ', '.').toLowerCase()}_${uuidv4().substring(0, 4)}@test.com`,
      name: mock.name,
      city: mock.city,
      state: mock.state,
      role: "athlete"
    }).select().single();
    
    if (userErr) throw userErr;
    athletes.push(user);
    console.log(`✅ Athlete created: ${user.name}`);
  }

  // 3. Create a Championship
  const { data: championship, error: champErr } = await supabase.from('championships').insert({
    organizer_id: organizer.id,
    name: "Copa das Estrelas 2025",
    city: "São Paulo",
    state: "SP",
    category: "amador",
    format: "grupos_mata_mata",
    max_teams: 8,
    status: "in_progress",
    is_official: true,
  }).select().single();

  if (champErr) throw champErr;
  console.log("✅ Championship created:", championship.name);

  // 4. Generate random Matches to distribute ELO
  console.log("⚔️ Generating Matches...");
  for (let i = 0; i < 40; i++) {
    // Pick 4 random athletes
    const shuffled = [...athletes].sort(() => 0.5 - Math.random());
    const matchAthletes = shuffled.slice(0, 4);

    const team1A = matchAthletes[0];
    const team1B = matchAthletes[1];
    const team2A = matchAthletes[2];
    const team2B = matchAthletes[3];

    // Create Teams
    const { data: team1 } = await supabase.from('teams').insert({
      athlete1_id: team1A.id, athlete2_id: team1B.id, championship_id: championship.id
    }).select().single();

    const { data: team2 } = await supabase.from('teams').insert({
      athlete1_id: team2A.id, athlete2_id: team2B.id, championship_id: championship.id
    }).select().single();

    if (!team1 || !team2) continue;

    const s1 = Math.floor(Math.random() * 5) + 18; // score 18-22
    let s2 = Math.floor(Math.random() * 5) + 15; // score 15-19
    if (s1 === s2) s2 -= 2;

    const { data: match } = await supabase.from('matches').insert({
      championship_id: championship.id,
      team1_id: team1.id,
      team2_id: team2.id,
      score_team1: s1,
      score_team2: s2,
      winner_team_id: s1 > s2 ? team1.id : team2.id,
      elo_processed: true,
      played_at: new Date(Date.now() - Math.random() * 10000000000).toISOString()
    }).select().single();

    if (!match) continue;

    // Simulate ELO processing using the RPC since we are seeding via script
    // Or we can just calculate it in TS and update.
    
    // Get current profiles
    const { data: profiles } = await supabase.from('athlete_profiles')
      .select('user_id, rating')
      .in('user_id', matchAthletes.map(a => a.id));

    const getRating = (id: string) => profiles?.find(p => p.user_id === id)?.rating || 1000;

    const eloResults = processMatch({
      athlete1Team1Rating: getRating(team1A.id),
      athlete2Team1Rating: getRating(team1B.id),
      athlete1Team2Rating: getRating(team2A.id),
      athlete2Team2Rating: getRating(team2B.id),
      scoreTeam1: s1,
      scoreTeam2: s2,
      isOfficial: true,
    });

    const posToId: Record<string, string> = {
      team1_athlete1: team1A.id, team1_athlete2: team1B.id,
      team2_athlete1: team2A.id, team2_athlete2: team2B.id,
    };

    for (const res of eloResults) {
      const aId = posToId[res.athletePosition];
      const newLevel = getLevelForRating(res.ratingAfter).name;
      
      // Update stats
      await supabase.rpc('increment_match_stats', {
        p_user_id: aId,
        p_new_rating: res.ratingAfter,
        p_new_level: newLevel,
        p_won: res.delta > 0
      });

      // Insert history
      await supabase.from('elo_history').insert({
        athlete_id: aId,
        match_id: match.id,
        rating_before: res.ratingBefore,
        rating_after: res.ratingAfter,
        delta: res.delta,
        created_at: match.played_at
      });
    }
  }

  console.log("✅ Seed completed successfully!");
}

runSeed().catch(console.error);
