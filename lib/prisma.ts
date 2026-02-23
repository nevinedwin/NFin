import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'  // ← Change this line
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL || 'postgresql://placeholder:placeholder@localhost:5432/placeholder'
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ adapter })
} else {
  if (!(global as any).prisma) {
    ;(global as any).prisma = new PrismaClient({ adapter })
  }
  prisma = (global as any).prisma
}

export { prisma }