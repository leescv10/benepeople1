import { HomepageConfig } from "../types";

const JSON_HEADERS = { "Content-Type": "application/json" };

export async function fetchHomepageConfig(): Promise<Partial<HomepageConfig> | null> {
  const response = await fetch("/api/homepage-config");
  if (!response.ok) {
    throw new Error("홈페이지 설정을 불러오지 못했습니다.");
  }

  const payload = await response.json();
  return payload.config ?? null;
}

export async function saveHomepageConfig(config: HomepageConfig): Promise<HomepageConfig> {
  const response = await fetch("/api/homepage-config", {
    method: "PUT",
    headers: JSON_HEADERS,
    credentials: "include",
    body: JSON.stringify({ config }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error || "홈페이지 설정 저장에 실패했습니다.");
  }

  const payload = await response.json();
  return payload.config;
}
