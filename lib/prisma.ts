import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL || 'postgresql://placeholder:placeholder@localhost:5432/placeholder'
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

let prisma: PrismaClient

declare global {
  // allow attaching the client to the global object in dev to avoid
  // hot-reload creating multiple instances
  // eslint-disable-next-line vars-on-top
  var prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ adapter })
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({ adapter })
  }
  prisma = global.prisma
}

export { prisma }