import type { Config } from "@netlify/functions";

const DEMO_ACCOUNTS = [
  {
    email: "admin@benepeople.com",
    password: process.env.DEMO_ADMIN_PASSWORD,
    companyName: "(주)베네피플 일렉트릭",
  },
  {
    email: "partner@esgcorp.kr",
    password: process.env.DEMO_PARTNER_PASSWORD,
    companyName: "ESG 환경코퍼레이션",
  },
] as const;

export default async (req: Request) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed." }, { status: 405 });
  }

  const { email, password } = await req.json().catch(() => ({ email: "", password: "" }));

  if (!email || !password) {
    return Response.json({ error: "아이디(이메일)와 비밀번호를 모두 입력해 주세요." }, { status: 400 });
  }

  if (
    process.env.ADMIN_LOGIN_ID &&
    process.env.ADMIN_LOGIN_PASSWORD &&
    email === process.env.ADMIN_LOGIN_ID &&
    password === process.env.ADMIN_LOGIN_PASSWORD
  ) {
    return Response.json({ companyName: "최고관리자 (ADMIN)" });
  }

  const matchedDemoAccount = DEMO_ACCOUNTS.find(
    (account) => account.password && email === account.email && password === account.password
  );

  if (matchedDemoAccount) {
    return Response.json({ companyName: matchedDemoAccount.companyName });
  }

  if (email !== process.env.ADMIN_LOGIN_ID && password.length >= 6) {
    const companyName = email.includes("esgcorp") ? "ESG 환경코퍼레이션" : "(주)베네피플 일렉트릭";
    return Response.json({ companyName });
  }

  return Response.json(
    { error: "일치하는 계정 정보가 없습니다. 아이디와 비밀번호를 다시 확인해 주세요." },
    { status: 401 }
  );
};

export const config: Config = {
  path: "/api/demo-login",
  method: "POST",
};
