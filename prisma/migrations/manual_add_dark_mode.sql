-- Manual migration to add is_dark_mode column to themes table
ALTER TABLE "themes" 
ADD COLUMN IF NOT EXISTS "is_dark_mode" BOOLEAN NOT NULL DEFAULT false;