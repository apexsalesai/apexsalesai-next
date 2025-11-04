/**
 * Intelligence Layer — Formatters
 * 
 * Utility functions for formatting KPI values.
 */

export const money = (n: number) => 
  n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const pct = (n: number) => `${n.toFixed(1)}%`;

export const num = (n: number) => n.toLocaleString();

export const hrs = (n: number) => `${n.toFixed(1)}h`;
