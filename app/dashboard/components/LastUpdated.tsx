"use client";
import { useEffect, useState } from "react";

export function LastUpdated() {
  const [ts, setTs] = useState<string>("");
  useEffect(()=>{ setTs(new Date().toLocaleString()); },[]);
  return <span className="text-xs text-slate-400">Updated {ts}</span>;
}
