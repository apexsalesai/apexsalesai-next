"use client";
import { LineChart, Line, ResponsiveContainer } from "recharts";

export default function TrendSparkline({ data, intent="neutral" }:{
  data: number[]; intent?: "good"|"bad"|"neutral";
}) {
  const mapped = data.map((v, i)=>({ i, v }));
  return (
    <div className="h-10 w-full">
      <ResponsiveContainer>
        <LineChart data={mapped} margin={{ top: 8, bottom: 0, left: 0, right: 0 }}>
          <Line type="monotone" dataKey="v" dot={false} strokeOpacity={0.85} strokeWidth={2}
            stroke={ intent==="good" ? "#22d3ee" : intent==="bad" ? "#fb7185" : "#94a3b8" } />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
