import type { Config } from "@netlify/functions";
import { getUser } from "@netlify/identity";
import { getDatabase } from "@netlify/database";

const SETTING_KEY = "homepage";

function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
}

function hasAdminRole(user: any) {
  const roles = [
    ...(user?.appMetadata?.roles || []),
    ...(user?.app_metadata?.roles || []),
    ...(user?.userMetadata?.roles || []),
    ...(user?.user_metadata?.roles || []),
  ];
  return roles.includes("admin") || roles.includes("super_admin");
}

async function requireAdmin() {
  const user = await getUser();
  if (!user) return null;
  return hasAdminRole(user) ? user : null;
}

export default async (req: Request) => {
  const database = getDatabase();

  if (req.method === "GET") {
    const rows = await database.sql`
      SELECT value
      FROM site_settings
      WHERE key = ${SETTING_KEY}
      LIMIT 1
    `;

    return json({ config: rows[0]?.value ?? null });
  }

  if (req.method === "PUT") {
    const admin = await requireAdmin();
    if (!admin) {
      return json({ error: "최고 관리자 권한이 필요합니다." }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    if (!body?.config || typeof body.config !== "object" || Array.isArray(body.config)) {
      return json({ error: "저장할 홈페이지 설정이 올바르지 않습니다." }, { status: 400 });
    }

    const [row] = await database.sql`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES (${SETTING_KEY}, ${JSON.stringify(body.config)}::jsonb, now())
      ON CONFLICT (key)
      DO UPDATE SET value = EXCLUDED.value, updated_at = now()
      RETURNING value
    `;

    return json({ config: row.value });
  }

  return json({ error: "Method not allowed" }, { status: 405 });
};

export const config: Config = {
  path: "/api/homepage-config",
};
