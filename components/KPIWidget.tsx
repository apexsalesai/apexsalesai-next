import React, { useEffect, useState } from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

interface KPIWidgetProps {
  // Support both naming conventions
  title?: string;
  label?: string;
  value: number | string;
  delta?: string;
  trend?: number;
  format?: 'number' | 'currency' | 'percentage';
}

export const KPIWidget: React.FC<KPIWidgetProps> = ({ title, label, value, delta, trend, format }) => {
  // Use title or label, preferring title if both are provided
  const displayTitle = title || label || '';
  
  // Handle string values for non-animated display
  const isNumericValue = typeof value === 'number';
  const [displayValue, setDisplayValue] = useState(isNumericValue ? 0 : value);
  
  // Convert trend to delta format if provided
  const displayDelta = delta || (trend !== undefined ? `${trend > 0 ? '+' : ''}${trend}%` : undefined);
  
  useEffect(() => {
    // Only animate if value is a number
    if (!isNumericValue) return;
    
    let start = 0;
    const duration = 800;
    const startTime = performance.now();
    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayValue(Math.floor(start + ((value as number) - start) * progress));
      if (progress < 1) requestAnimationFrame(animate);
    }
    animate(performance.now());
  }, [value, isNumericValue]);

  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bg = useColorModeValue('white', 'gray.800');
  const deltaColor = displayDelta?.startsWith('-') ? 'red.400' : 'green.400';

  return (
    <Box
      borderWidth={1}
      borderRadius={12}
      p={5}
      minW={28}
      textAlign="center"
      bg={bg}
      borderColor={borderColor}
      boxShadow="sm"
      role="region"
      aria-label={displayTitle}
    >
      <Text fontSize="sm" color="gray.500" mb={1} fontWeight="medium">
        {displayTitle}
      </Text>
      <AnimatePresence mode="wait">
        <motion.div
          key={String(displayValue)}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.1, opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Text fontSize="3xl" fontWeight="bold" color={useColorModeValue('gray.900', 'white')}>
            {displayValue}
          </Text>
        </motion.div>
      </AnimatePresence>
      {displayDelta && (
        <Text color={deltaColor} fontSize="xs" mt={1} aria-label="delta">
          {displayDelta}
        </Text>
      )}
    </Box>
  );
};
