-- ============================================
-- QuadraHub — Migration 002
-- Adiciona RPC ausente para processamento de ELO
-- ============================================

CREATE OR REPLACE FUNCTION public.increment_match_stats(
  p_user_id uuid,
  p_new_rating integer,
  p_new_level text,
  p_won boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.athlete_profiles
  SET
    wins = wins + CASE WHEN p_won THEN 1 ELSE 0 END,
    losses = losses + CASE WHEN NOT p_won THEN 1 ELSE 0 END,
    total_matches = total_matches + 1,
    rating = p_new_rating,
    level = p_new_level
  WHERE user_id = p_user_id;
END;
$$;
