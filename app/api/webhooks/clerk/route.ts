import { Webhook } from "svix";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        return new Response("Missing webhook secret", { status: 500 });
    }

    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Missing svix headers", { status: 400 });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: any;

    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });
    } catch (err) {
        return new Response("Invalid signature", { status: 400 });
    }

    const eventType = evt.type;
    const data = evt.data;

    try {
        // ================================
        // USER CREATED / UPDATED
        // ================================
        if (eventType === "user.created" || eventType === "user.updated") {
            const email = data.email_addresses?.[0]?.email_address;

            if (!email) {
                return new Response("Email missing", { status: 400 });
            }

            await prisma.user.upsert({
                where: { email }, // EMAIL IS UNIQUE ID
                update: {
                    clerkUserId: data.id, // always update to latest
                    name: data.first_name ?? "",
                    imageUrl: data.image_url ?? "",
                },
                create: {
                    email,
                    clerkUserId: data.id,
                    name: data.first_name ?? "",
                    imageUrl: data.image_url ?? "",
                },
            });
        }

        // ================================
        // USER DELETED
        // ================================
        if (eventType === "user.deleted") {
            const email = data.email_addresses?.[0]?.email_address;

            if (email) {
                await prisma.user.delete({
                    where: { email },
                });
            }
        }

        return new Response("Webhook processed", { status: 200 });

    } catch (error) {
        console.error("Webhook DB error:", error);
        return new Response("Database error", { status: 500 });
    }
}