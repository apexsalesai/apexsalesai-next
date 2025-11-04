"use client";
import { cn } from "@/lib/utils";

type Item = { id:string; label:string; };

export default function SegmentedToggle({ items, value, onChange }:{
  items: Item[]; value: string; onChange: (id:string)=>void;
}) {
  return (
    <div className="glass inline-flex p-1">
      {items.map((it)=>(
        <button key={it.id}
          className={cn(
            "px-3 py-1 text-sm rounded-xl transition focus:outline-none focus:ring-2 focus:ring-cyan-400/60",
            value===it.id ? "bg-white/10 text-cyan-200" : "text-slate-300 hover:text-white"
          )}
          onClick={()=>onChange(it.id)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
