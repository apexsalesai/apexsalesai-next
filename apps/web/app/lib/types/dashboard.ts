export interface KPI {
  title: string;
  value: string;
  trend: string;
  badgeColor: string;
}

export interface ChartData {
  labels: string[];
  data: number[];
  colors?: string[];
  color?: string;
}

export interface DepartmentData {
  title: string;
  kpis: KPI[];
  charts: Record<string, ChartData>;
  activity: string[];
}

export interface MockData {
  [key: string]: DepartmentData;
}

export interface DataMode {
  isLive: boolean;
  toggleLiveMode: () => void;
}
