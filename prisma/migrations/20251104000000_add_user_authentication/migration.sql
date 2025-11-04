-- AlterTable
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email" TEXT,
ADD COLUMN IF NOT EXISTS "password" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email") WHERE "email" IS NOT NULL;

-- Update existing users to have a default password (they won't be able to login until they register properly)
UPDATE "users" SET "password" = '' WHERE "password" IS NULL;

-- Make password NOT NULL after setting defaults
ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL;
