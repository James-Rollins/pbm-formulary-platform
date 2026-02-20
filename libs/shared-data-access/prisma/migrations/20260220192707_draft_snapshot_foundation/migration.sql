-- CreateEnum
CREATE TYPE "FormularyVersionState" AS ENUM ('DRAFT', 'PUBLISHED', 'RETIRED');

-- CreateTable
CREATE TABLE "plan" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drug" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "ndc11" TEXT NOT NULL,
    "labelName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "drug_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formulary" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "formulary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formulary_version" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "formularyId" TEXT NOT NULL,
    "state" "FormularyVersionState" NOT NULL DEFAULT 'DRAFT',
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "formulary_version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "draft_entry" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "tier" INTEGER,
    "status" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "draft_entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "published_coverage" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "ndc11" TEXT NOT NULL,
    "tier" INTEGER,
    "status" TEXT,
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "published_coverage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_event" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "correlationId" TEXT,
    "actorUserId" TEXT,
    "actorRole" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "detailsJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "plan_clientId_idx" ON "plan"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "plan_clientId_name_key" ON "plan"("clientId", "name");

-- CreateIndex
CREATE INDEX "drug_clientId_ndc11_idx" ON "drug"("clientId", "ndc11");

-- CreateIndex
CREATE UNIQUE INDEX "drug_clientId_ndc11_key" ON "drug"("clientId", "ndc11");

-- CreateIndex
CREATE INDEX "formulary_clientId_idx" ON "formulary"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "formulary_clientId_name_key" ON "formulary"("clientId", "name");

-- CreateIndex
CREATE INDEX "formulary_version_clientId_idx" ON "formulary_version"("clientId");

-- CreateIndex
CREATE INDEX "formulary_version_clientId_formularyId_idx" ON "formulary_version"("clientId", "formularyId");

-- CreateIndex
CREATE INDEX "formulary_version_clientId_state_idx" ON "formulary_version"("clientId", "state");

-- CreateIndex
CREATE INDEX "draft_entry_clientId_versionId_idx" ON "draft_entry"("clientId", "versionId");

-- CreateIndex
CREATE INDEX "draft_entry_clientId_drugId_idx" ON "draft_entry"("clientId", "drugId");

-- CreateIndex
CREATE UNIQUE INDEX "draft_entry_clientId_versionId_drugId_key" ON "draft_entry"("clientId", "versionId", "drugId");

-- CreateIndex
CREATE INDEX "published_coverage_clientId_planId_ndc11_idx" ON "published_coverage"("clientId", "planId", "ndc11");

-- CreateIndex
CREATE INDEX "published_coverage_clientId_versionId_idx" ON "published_coverage"("clientId", "versionId");

-- CreateIndex
CREATE UNIQUE INDEX "published_coverage_clientId_versionId_planId_ndc11_key" ON "published_coverage"("clientId", "versionId", "planId", "ndc11");

-- CreateIndex
CREATE INDEX "audit_event_clientId_createdAt_idx" ON "audit_event"("clientId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_event_correlationId_idx" ON "audit_event"("correlationId");

-- AddForeignKey
ALTER TABLE "plan" ADD CONSTRAINT "plan_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drug" ADD CONSTRAINT "drug_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formulary" ADD CONSTRAINT "formulary_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formulary_version" ADD CONSTRAINT "formulary_version_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formulary_version" ADD CONSTRAINT "formulary_version_formularyId_fkey" FOREIGN KEY ("formularyId") REFERENCES "formulary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "draft_entry" ADD CONSTRAINT "draft_entry_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "formulary_version"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "draft_entry" ADD CONSTRAINT "draft_entry_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "draft_entry" ADD CONSTRAINT "draft_entry_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "published_coverage" ADD CONSTRAINT "published_coverage_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "formulary_version"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "published_coverage" ADD CONSTRAINT "published_coverage_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "published_coverage" ADD CONSTRAINT "published_coverage_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "published_coverage" ADD CONSTRAINT "published_coverage_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_event" ADD CONSTRAINT "audit_event_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
