-- =============================================================================
-- 003_indexes_foreign_keys.sql — Index sur les clés étrangères
-- À exécuter si 001_schema a été appliqué sans ces index (linter unindexed_foreign_keys).
-- Ré-exécutable (CREATE INDEX IF NOT EXISTS).
-- =============================================================================

create index if not exists idx_messages_user_id on public.messages(user_id);
create index if not exists idx_events_created_by on public.events(created_by);
