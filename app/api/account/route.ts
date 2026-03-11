'use server';

import { prisma } from "@/lib/prisma";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  const accounts = await prisma.account.findMany({
    where: {
      ...(q
        ? {
            name: {
              contains: q,
              mode: "insensitive"
            }
          }
        : {})
    },
    take: 20
  });

  return Response.json(
    accounts.map((a) => ({
      value: a.id,
      label: a.name
    }))
  );
}