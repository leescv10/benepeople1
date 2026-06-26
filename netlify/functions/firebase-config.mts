import type { Config } from "@netlify/functions";

const requiredConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

export default async () => {
  const missingConfig = Object.entries(requiredConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingConfig.length > 0) {
    return Response.json(
      { error: `Missing Firebase configuration: ${missingConfig.join(", ")}` },
      { status: 500 }
    );
  }

  return Response.json({
    ...requiredConfig,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || undefined,
  });
};

export const config: Config = {
  path: "/api/firebase-config",
  method: "GET",
};
