import { MockData, DataMode } from './types/dashboard';
import mockData from './mockData';

// Create reactive data store
const dataStore = {
  mockData,
  mode: {
    isLive: false,
    toggleLiveMode: () => {
      dataStore.mode.isLive = !dataStore.mode.isLive;
      
      // Simulate live data updates
      if (dataStore.mode.isLive) {
        const updateKPIs = () => {
          Object.keys(mockData).forEach(dept => {
            const department = mockData[dept as keyof typeof mockData];
            department.kpis.forEach(kpi => {
              if (Math.random() > 0.8) { // 20% chance to update
                const currentValue = parseFloat(kpi.value.replace(/[^\d.-]+/g, ''));
                const trend = Math.random() < 0.5 ? '+' : '-';
                const change = Math.random() * 10;
                
                // Update value based on current value and trend
                let newValue = currentValue;
                if (kpi.title.includes('Rate') || kpi.title.includes('%')) {
                  newValue = Math.max(0, Math.min(100, currentValue + (trend === '+' ? change : -change)));
                  kpi.value = `${Math.round(newValue)}%`;
                } else if (kpi.title.includes('Time')) {
                  newValue = Math.max(0, currentValue + (trend === '+' ? change : -change));
                  kpi.value = `${Math.round(newValue)}m`;
                } else if (kpi.title.includes('Cost') || kpi.title.includes('Savings')) {
                  newValue = Math.max(0, currentValue + (trend === '+' ? change : -change) * 1000);
                  kpi.value = `$${Math.round(newValue).toLocaleString()}`;
                } else {
                  newValue = Math.max(0, currentValue + (trend === '+' ? change : -change));
                  kpi.value = `${Math.round(newValue)}`;
                }
                
                kpi.trend = `${trend}${Math.floor(change * 100)}% MoM`;
              }
            });
          });
        };

        // Start interval for updates
        const interval = setInterval(updateKPIs, 5000);

        // Clean up interval when mode is toggled off
        return () => clearInterval(interval);
      }
    }
  }
};

export { dataStore };
