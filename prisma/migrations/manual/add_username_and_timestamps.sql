-- Füge die neuen Spalten hinzu
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "username" TEXT UNIQUE;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Aktualisiere das role-Feld für bestehende Einträge
UPDATE "User" SET "role" = 'USER' WHERE "role" = 'user';

-- Setze temporäre Benutzernamen für bestehende Benutzer
UPDATE "User" SET "username" = "email" WHERE "username" IS NULL;
