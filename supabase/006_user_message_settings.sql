-- =============================================================================
-- 006_user_message_settings.sql — Réglage "disparition après lecture"
-- À exécuter après 005_message_reads.sql.
-- Préférence par utilisateur : délai en minutes avant que le message disparaisse
-- de la vue du lecteur après qu'il l'ait lu (15, 30, 45 ou 60 min).
-- UI : dropdown dans la page Messages (paramètres).
-- =============================================================================

alter table public.users
  add column if not exists message_disappear_after_minutes smallint
  default 30
  constraint users_message_disappear_check
  check (message_disappear_after_minutes in (15, 30, 45, 60));

comment on column public.users.message_disappear_after_minutes is 'Délai (min) avant disparition du message après lecture pour cet utilisateur ; 15, 30, 45 ou 60. Utilisé côté app pour filtrer les messages visibles.';

-- RLS : pas de changement (users_update_own permet déjà à l'utilisateur de mettre à jour sa ligne).
