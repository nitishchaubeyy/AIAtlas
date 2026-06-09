-- Add unique constraint: one review per user per entity
CREATE UNIQUE INDEX IF NOT EXISTS "reviews_user_id_entity_type_entity_id_key"
  ON "reviews"("user_id", "entity_type", "entity_id");
