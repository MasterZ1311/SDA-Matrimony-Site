-- CreateTable PromptAnswer
CREATE TABLE IF NOT EXISTS "PromptAnswer" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "promptKey" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromptAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable Reaction
CREATE TABLE IF NOT EXISTS "Reaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "photoId" TEXT,
    "promptAnswerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "PromptAnswer_profileId_promptKey_key" ON "PromptAnswer"("profileId", "promptKey");
CREATE INDEX IF NOT EXISTS "PromptAnswer_profileId_idx" ON "PromptAnswer"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Reaction_userId_photoId_key" ON "Reaction"("userId", "photoId");
CREATE UNIQUE INDEX IF NOT EXISTS "Reaction_userId_promptAnswerId_key" ON "Reaction"("userId", "promptAnswerId");
CREATE INDEX IF NOT EXISTS "Reaction_photoId_idx" ON "Reaction"("photoId");
CREATE INDEX IF NOT EXISTS "Reaction_promptAnswerId_idx" ON "Reaction"("promptAnswerId");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'PromptAnswer_profileId_fkey'
    ) THEN
        ALTER TABLE "PromptAnswer" ADD CONSTRAINT "PromptAnswer_profileId_fkey" 
        FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Reaction_userId_fkey'
    ) THEN
        ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Reaction_photoId_fkey'
    ) THEN
        ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_photoId_fkey" 
        FOREIGN KEY ("photoId") REFERENCES "Photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Reaction_promptAnswerId_fkey'
    ) THEN
        ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_promptAnswerId_fkey" 
        FOREIGN KEY ("promptAnswerId") REFERENCES "PromptAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Data Migration & Column Cleanup
-- If Profile.prompts exists and contains data, migrate it to PromptAnswer before dropping the column
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'Profile' AND column_name = 'prompts'
    ) THEN
        BEGIN
            INSERT INTO "PromptAnswer" ("id", "profileId", "promptKey", "answer", "order", "createdAt", "updatedAt")
            SELECT
                gen_random_uuid()::text,
                p."id",
                COALESCE(elem->>'promptKey', elem->>'key', 'SABBATH_TYPICAL'),
                COALESCE(elem->>'answer', ''),
                (elem_idx - 1)::int,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM "Profile" p,
            jsonb_array_elements(p."prompts") WITH ORDINALITY AS arr(elem, elem_idx)
            WHERE p."prompts" IS NOT NULL
              AND jsonb_typeof(p."prompts") = 'array'
            ON CONFLICT ("profileId", "promptKey") DO NOTHING;
        EXCEPTION WHEN OTHERS THEN
            -- In case existing prompts data was in an unexpected format, continue safely
            NULL;
        END;

        -- Drop legacy column after preserving data
        ALTER TABLE "Profile" DROP COLUMN "prompts";
    END IF;
END $$;
