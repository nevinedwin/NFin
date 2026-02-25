import { Webhook } from "svix";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error("Missing CLERK_WEBHOOK_SECRET");
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

    const eventType = evt?.type;

    // Handle Clerk events
    if (eventType === "user.created" || eventType === "user.updated") {
        console.log(evt.data);
        const { id, email_addresses, first_name, image_url } = evt?.data;

        const email = email_addresses?.[0]?.email_address;

        if (!email) {
            return new Response("Email missing", { status: 400 });
        }

        await prisma.user.upsert({
            where: { clerkUserId: id },
            update: {
                email,
                name: first_name,
                imageUrl: image_url,
                updatedAt: new Date(),
            },
            create: {
                clerkUserId: id,
                email,
                name: first_name,
                imageUrl: image_url,
            },
        });
    }

    return new Response("Webhook processed", { status: 200 });
}