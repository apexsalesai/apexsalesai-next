/**
 * Asset save utilities with versioning support
 */

import { patchJSON } from '@lib/http';

interface SaveAssetResponse {
  data: {
    id: string;
    version: number;
  };
}

export async function saveAsset(
  assetId: string, 
  body: { title?: string; body?: string; metadata?: any }, 
  asNewVersion = false
) {
  const url = `/api/studio/assets/${assetId}${asNewVersion ? '?newVersion=true' : ''}`;
  return patchJSON<SaveAssetResponse>(url, body);
}
