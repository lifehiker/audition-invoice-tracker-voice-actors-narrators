"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Point = {
  label: string;
  rate: number;
  benchmark: number;
};

export function RateHistoryChart({ data }: { data: Point[] }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="label" stroke="#7b7062" />
          <YAxis stroke="#7b7062" />
          <Tooltip />
          <Line type="monotone" dataKey="rate" stroke="#a74f2a" strokeWidth={3} />
          <Line type="monotone" dataKey="benchmark" stroke="#1d6f6d" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
