/**
 * KPI Refresh Button Component
 * Provides manual refresh functionality for live Dataverse KPI data
 */

import React, { useState } from 'react';
import { Button, Spinner, Tooltip } from '@chakra-ui/react';
import { RefreshCw } from 'lucide-react';

interface KPIRefreshButtonProps {
  onRefresh: () => Promise<void>;
  isDataverseConnected: boolean;
  vertical: string;
  className?: string;
}

export const KPIRefreshButton: React.FC<KPIRefreshButtonProps> = ({
  onRefresh,
  isDataverseConnected,
  vertical,
  className
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await onRefresh();
    } catch (error) {
      console.error('Failed to refresh KPIs:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const buttonColor = isDataverseConnected ? 'blue' : 'gray';
  const tooltipText = isDataverseConnected 
    ? `Refresh live ${vertical} KPIs from Dataverse`
    : 'Dataverse not connected - using fallback data';

  return (
    <Tooltip label={tooltipText} placement="top">
      <Button
        size="sm"
        colorScheme={buttonColor}
        variant="outline"
        onClick={handleRefresh}
        isLoading={isRefreshing}
        loadingText="Refreshing"
        className={className}
        leftIcon={
          isRefreshing ? (
            <Spinner size="xs" />
          ) : (
            <RefreshCw size={14} />
          )
        }
      >
        Refresh KPIs
      </Button>
    </Tooltip>
  );
};
