-- AlterEnum
ALTER TYPE "OnboardingSteps" ADD VALUE 'USERNAME';

-- AlterTable
ALTER TABLE "Onboarding" ALTER COLUMN "requiredSteps" SET DEFAULT ARRAY['CREDENTIALS', 'PERSONAL_INFO', 'ORGANIZATION']::"OnboardingSteps"[];
