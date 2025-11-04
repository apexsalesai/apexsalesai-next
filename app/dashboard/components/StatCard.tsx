"use client";
import TrendSparkline from "./TrendSparkline";
import { cn } from "@/lib/utils";
import { money, pct, num, hrs } from "@/lib/intelligence/formatters";

export default function StatCard({ kpi }:{ kpi: {
  label:string, value:number, deltaPct:number, trend:number[], unit:"$"|"%"|"num"|"hrs", intent:"good"|"bad"|"neutral", target:number|null
}}) {
  const format = (v:number)=>{
    switch(kpi.unit){
      case "$":  return money(v);
      case "%":  return pct(v);
      case "num": return num(v);
      case "hrs": return hrs(v);
    }
  };
  const deltaClass = kpi.deltaPct >= 0 ? "text-emerald-300" : "text-rose-300";
  return (
    <div className={cn("glass p-4 md:p-5 transition hover:scale-[1.01]")}>
      <div className="flex items-center justify-between">
        <div className="text-slate-300 text-sm">{kpi.label}</div>
        {kpi.target && <div className="text-[11px] text-slate-500">Target: {format(kpi.target)}</div>}
      </div>
      <div className="mt-1 flex items-end justify-between">
        <div className="text-2xl md:text-3xl font-semibold">{format(kpi.value)}</div>
        <div className={cn("text-xs", deltaClass)}>{kpi.deltaPct>=0?"+":""}{kpi.deltaPct.toFixed(1)}%</div>
      </div>
      <div className="mt-2">
        <TrendSparkline data={kpi.trend} intent={kpi.intent}/>
      </div>
    </div>
  );
}
