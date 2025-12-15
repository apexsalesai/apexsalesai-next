import type { NextApiRequest, NextApiResponse } from "next";
import packageJson from "../../package.json";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const commit =
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.COMMIT_SHA ||
    process.env.BUILD_SHA ||
    "unknown";

  const buildId =
    process.env.NEXT_PUBLIC_BUILD_ID ||
    commit ||
    "unknown";

  const generatedAt =
    process.env.BUILD_TIME ||
    new Date().toISOString();

  res.status(200).json({
    name: packageJson.name,
    version: packageJson.version,
    buildId,
    commit,
    generatedAt,
  });
}
