/**
 * Intelligence Layer — Type Guards
 * 
 * Runtime validation using Zod schemas.
 */

import { ViewPayloadSchema, type ViewPayload } from "./types";

export function assertViewPayload(payload: unknown): ViewPayload {
  return ViewPayloadSchema.parse(payload);
}
