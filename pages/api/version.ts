import type { NextApiRequest, NextApiResponse } from "next";

type VersionResponse = {
  commit?: string;
  branch?: string;
  buildTime?: string;
  error?: string;
};

const TOKEN = process.env.VERSION_TOKEN;

export default function handler(req: NextApiRequest, res: NextApiResponse<VersionResponse>) {
  if (TOKEN) {
    const provided = req.query.token;
    if (!provided || provided !== TOKEN) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  return res.status(200).json({
    commit: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT || "unknown",
    branch: process.env.VERCEL_GIT_COMMIT_REF || process.env.GIT_BRANCH || "unknown",
    buildTime: new Date().toISOString(),
  });
}
