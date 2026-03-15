/*
  Warnings:

  - You are about to alter the column `balance` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `creditLimit` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `allocatedAmount` on the `BudgetCategory` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `spendAmount` on the `BudgetCategory` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `netAmount` on the `ContactBalance` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `targetAmount` on the `Goal` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `savedAmount` on the `Goal` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `amount` on the `GoalContribution` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `premiumAmount` on the `InsurancePolicy` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `coverageAmount` on the `InsurancePolicy` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `investedAmount` on the `Investment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `currentValue` on the `Investment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `sipAmount` on the `Investment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `interestRate` on the `Investment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `amount` on the `Settlement` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `shareAmount` on the `TransactionParticipant` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `obligationAmount` on the `TransactionParticipant` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `paidAmount` on the `TransactionParticipant` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.

*/
-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "balance" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "creditLimit" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "BudgetCategory" ALTER COLUMN "allocatedAmount" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "spendAmount" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "ContactBalance" ALTER COLUMN "netAmount" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Goal" ALTER COLUMN "targetAmount" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "savedAmount" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "GoalContribution" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "InsurancePolicy" ALTER COLUMN "premiumAmount" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "coverageAmount" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Investment" ALTER COLUMN "investedAmount" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "currentValue" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "sipAmount" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "interestRate" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Settlement" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "TransactionParticipant" ALTER COLUMN "shareAmount" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "obligationAmount" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "paidAmount" SET DATA TYPE DECIMAL(12,2);
