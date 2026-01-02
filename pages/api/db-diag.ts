import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const url = process.env.DATABASE_URL || "";
    // sanitize: never return credentials
    const safe = (() => {
      try {
        const u = new URL(url);
        return {
          host: u.host,
          pathname: u.pathname,      // shows the DB name you're really targeting
          queryKeys: [...u.searchParams.keys()],
        };
      } catch {
        return { host: "invalid", pathname: "invalid", queryKeys: [] };
      }
    })();

    const rows = await prisma.$queryRaw<
      Array<{
        current_user: string;
        current_database: string;
        current_schema: string;
        client_addr: string | null;
        server_addr: string | null;
      }>
    >`
      select
        current_user as current_user,
        current_database() as current_database,
        current_schema() as current_schema,
        inet_client_addr()::text as client_addr,
        inet_server_addr()::text as server_addr
    `;

    res.status(200).json({ safeDatabaseUrl: safe, db: rows[0] });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || String(e) });
  }
}
