"use client";

import EchoBreakerClient from "./EchoBreakerClient";
import { Providers } from "./providers";

export default function EchoBreakerPage() {
  return (
    <Providers>
      <EchoBreakerClient />
    </Providers>
  );
}
