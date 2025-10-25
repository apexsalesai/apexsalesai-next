import React, { useState } from 'react';
import { Box, Stat, StatLabel, StatNumber, StatHelpText, Badge, Spinner, Button, VStack, useColorModeValue } from '@chakra-ui/react';

const PipelineForecastWidget: React.FC = () => {
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function fetchForecast() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/pipeline/forecast.ts', { method: 'POST' });
      const data = await res.json();
      setForecast(data.forecast);
    } catch (e: any) {
      setError('Error fetching forecast.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box bg={useColorModeValue('white', 'gray.900')} p={5} borderRadius="2xl" boxShadow="xl" minW="320px" maxW="380px" mx="auto">
      <Stat>
        <StatLabel fontWeight="bold" color="cyan.700">AI Pipeline Forecast</StatLabel>
        {loading ? (
          <Spinner color="cyan.400" size="lg" />
        ) : forecast ? (
          <>
            <StatNumber color="green.500" fontSize="2xl">{extractValue(forecast, 'Forecasted Revenue')}</StatNumber>
            <StatHelpText>Close Rate: <Badge colorScheme="cyan">{extractValue(forecast, 'Predicted Close Rate')}</Badge></StatHelpText>
            <Box mt={1} color="purple.600" fontSize="sm" fontWeight="bold">
              {extractValue(forecast, 'Pipeline Risks')}
            </Box>
          </>
        ) : (
          <Button colorScheme="cyan" variant="outline" onClick={fetchForecast} size="sm">Get Forecast</Button>
        )}
        {error && <Box color="red.500" fontSize="sm">{error}</Box>}
      </Stat>
      {forecast && (
        <VStack align="start" spacing={1} mt={2}>
          <Box fontWeight="semibold" color="cyan.700">Key Insights</Box>
          {extractBullets(forecast, 'Key Insights').map((ins, i) => <Box key={i} fontSize="sm">• {ins}</Box>)}
        </VStack>
      )}
    </Box>
  );
};

function extractValue(text: string, label: string) {
  const match = text.match(new RegExp(`${label}: ([^\n]+)`));
  return match ? match[1].trim() : '';
}
function extractBullets(text: string, label: string) {
  const section = text.split(`${label}:`)[1] || '';
  return section.split('\n').map(l => l.replace(/^[-•]\s*/, '').trim()).filter(Boolean);
}

export default PipelineForecastWidget;
