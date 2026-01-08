import type { NextApiRequest, NextApiResponse } from "next";

function parse(urlStr?: string) {
  if (!urlStr) return { present: false };
  try {
    const u = new URL(urlStr);
    return {
      present: true,
      host: u.host,
      pathname: u.pathname,                 // must be "/neondb"
      dbName: u.pathname.replace("/", ""),  // must be "neondb"
      hasDotPublic: u.pathname.includes(".public"),
      schemaParam: u.searchParams.get("schema"),
      queryKeys: Array.from(u.searchParams.keys()),
    };
  } catch {
    return { present: true, invalid: true };
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    DATABASE_URL: parse(process.env.DATABASE_URL),
    DIRECT_URL: parse(process.env.DIRECT_URL),
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
  });
}
