-- AlterTable
ALTER TABLE "Onboarding" ALTER COLUMN "requiredSteps" SET DEFAULT ARRAY['CREDENTIALS', 'PERSONAL_INFO', 'ORGANIZATION', 'BILLING']::"OnboardingSteps"[];
