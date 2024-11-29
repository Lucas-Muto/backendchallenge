-- CreateTable
CREATE TABLE "Traveler" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "passportNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Traveler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Infraction" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "severity" TEXT NOT NULL,
    "passportNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Infraction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Traveler_passportNumber_key" ON "Traveler"("passportNumber");

-- AddForeignKey
ALTER TABLE "Infraction" ADD CONSTRAINT "Infraction_passportNumber_fkey" FOREIGN KEY ("passportNumber") REFERENCES "Traveler"("passportNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
