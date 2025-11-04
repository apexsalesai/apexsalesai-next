'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ExecutiveDashboard from './ExecutiveDashboard';
import SalesDashboard from './SalesDashboard';
import SupportDashboard from './SupportDashboard';
import OpsDashboard from './OpsDashboard';
import HRDashboard from './HRDashboard';
import FinanceDashboard from './FinanceDashboard';
import ProductDashboard from './ProductDashboard';
import { dataStore } from '../lib/dataStore';

import PipelineAI from '../dashboard/PipelineAI';

const tabs = [
  { id: 'executive', label: 'Executive', icon: '🏢', component: ExecutiveDashboard },
  { id: 'pipeline', label: 'Pipeline AI', icon: '🤖', component: PipelineAI },
  { id: 'sales', label: 'Sales & Marketing', icon: '📈', component: SalesDashboard },
  { id: 'support', label: 'Customer Success', icon: '🎧', component: SupportDashboard },
  { id: 'ops', label: 'Ops & IT', icon: '💻', component: OpsDashboard },
  { id: 'hr', label: 'HR', icon: '👥', component: HRDashboard },
  { id: 'finance', label: 'Finance', icon: '💰', component: FinanceDashboard },
];

export const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState('executive');
  const [isLive, setIsLive] = useState(dataStore.mode.isLive);

  const toggleLiveMode = () => {
    dataStore.mode.toggleLiveMode();
    setIsLive(dataStore.mode.isLive);
  };

  const renderDashboard = () => {
    const tab = tabs.find(t => t.id === activeTab);
    const DashboardComponent = tab?.component || ExecutiveDashboard;
    return <DashboardComponent />;
  };

  return (
    <>
      <h1 className="heading-xl text-center">ApexSalesAI Dashboards</h1>
      {/* Tab Navigation */}
      <div className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md rounded-full shadow-lg px-2 py-1 mx-auto w-full max-w-5xl border border-slate-800 overflow-x-auto scrollbar-hide">
        <div className="relative flex flex-row gap-2 justify-center items-center min-w-max">
          {tabs.map((tab, idx) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative z-10 flex flex-col items-center justify-center px-3 py-2 rounded-full font-semibold transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-blue-600 text-white border-2 border-cyan-400'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700/80 hover:text-cyan-300 border border-transparent'}
              `}
              style={{ minWidth: '140px' }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
              aria-selected={activeTab === tab.id}
            >
              <span className="text-2xl mb-1">{tab.icon}</span>
              <span className="text-sm tracking-wide">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
      {/* Dashboard Content */}
      <motion.div
        className="space-y-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderDashboard()}
      </motion.div>
    </>
  );
};

export default DashboardTabs;
