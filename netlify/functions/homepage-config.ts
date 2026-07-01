import type { Config } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { siteSettings } from "../../db/schema.js";

const HOMEPAGE_CONFIG_KEY = "homepage";

const jsonHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

export default async (req: Request) => {
  try {
    if (req.method === "GET") {
      const [setting] = await db
        .select({ value: siteSettings.value })
        .from(siteSettings)
        .where(eq(siteSettings.key, HOMEPAGE_CONFIG_KEY))
        .limit(1);

      return Response.json({ config: setting?.value ?? null }, { headers: jsonHeaders });
    }

    if (req.method === "PUT") {
      const body = await req.json().catch(() => null);
      const config = body?.config;

      if (!config || typeof config !== "object" || Array.isArray(config)) {
        return Response.json({ error: "Invalid homepage config." }, { status: 400, headers: jsonHeaders });
      }

      const [saved] = await db
        .insert(siteSettings)
        .values({
          key: HOMEPAGE_CONFIG_KEY,
          value: config,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: {
            value: config,
            updatedAt: new Date(),
          },
        })
        .returning({ value: siteSettings.value });

      return Response.json({ config: saved.value }, { headers: jsonHeaders });
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (error) {
    console.error("Homepage config API error:", error);
    return Response.json({ error: "Homepage config could not be saved." }, { status: 500, headers: jsonHeaders });
  }
};

export const config: Config = {
  path: "/api/homepage-config",
};
