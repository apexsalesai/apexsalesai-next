import { useState, useEffect } from 'react';
import { Box, Button, Container, Heading, Text, Stack, Alert, AlertIcon, AlertTitle, AlertDescription, useToast } from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Component to display HubSpot connection status
const ConnectionStatus = ({ isConnected, expiresAt }: { isConnected: boolean; expiresAt?: Date }) => {
  if (isConnected) {
    return (
      <Alert status="success" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" borderRadius="md" p={4}>
        <AlertIcon as={CheckCircleIcon} boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Connected to HubSpot
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          Your HubSpot account is connected and working properly.
          {expiresAt && (
            <Text mt={2} fontSize="sm">
              Token expires: {new Date(expiresAt).toLocaleString()}
            </Text>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert status="warning" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" borderRadius="md" p={4}>
      <AlertIcon as={WarningIcon} boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        Not Connected to HubSpot
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        Connect your HubSpot account to enable CRM integration features.
      </AlertDescription>
    </Alert>
  );
};

export default function HubSpotInstall() {
  const [isConnected, setIsConnected] = useState(false);
  const [tokenData, setTokenData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const toast = useToast();

  // Check for code parameter in URL (HubSpot OAuth callback)
  useEffect(() => {
    const { code } = router.query;
    
    // If we have a code, exchange it for an access token
    if (code) {
      exchangeCodeForToken(code as string);
    } else {
      // Otherwise check if we already have a token
      checkConnectionStatus();
    }
  }, [router.query]);

  // Function to exchange authorization code for token
  const exchangeCodeForToken = async (code: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/hubspot/install', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const data = await response.json();
      setTokenData(data);
      setIsConnected(true);
      
      toast({
        title: 'HubSpot Connected!',
        description: 'Your HubSpot account was successfully connected.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Remove the code from the URL to prevent re-exchanging on refresh
      router.replace('/install', undefined, { shallow: true });
    } catch (err) {
      console.error('Error exchanging code for token:', err);
      setError('Failed to connect to HubSpot. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to check if we're already connected
  const checkConnectionStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/hubspot/status');
      if (!response.ok) {
        throw new Error('Failed to check connection status');
      }

      const data = await response.json();
      setIsConnected(data.isConnected);
      setTokenData(data.token || null);
    } catch (err) {
      console.error('Error checking connection status:', err);
      setError('Failed to check HubSpot connection status.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to initiate HubSpot OAuth flow
  const connectToHubSpot = async () => {
    try {
      const response = await fetch('/api/hubspot/auth-url');
      if (!response.ok) {
        throw new Error('Failed to get authorization URL');
      }

      const { authUrl } = await response.json();
      window.location.href = authUrl;
    } catch (err) {
      console.error('Error initiating OAuth flow:', err);
      setError('Failed to start HubSpot connection process.');
    }
  };

  // Function to disconnect from HubSpot
  const disconnectFromHubSpot = async () => {
    try {
      const response = await fetch('/api/hubspot/disconnect', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect');
      }

      setIsConnected(false);
      setTokenData(null);
      
      toast({
        title: 'Disconnected',
        description: 'Your HubSpot account has been disconnected.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error disconnecting:', err);
      setError('Failed to disconnect from HubSpot.');
    }
  };

  return (
    <>
      <Head>
        <title>HubSpot Integration - ApexSalesAI</title>
      </Head>
      <Container maxW="container.md" py={10}>
        <Stack spacing={8}>
          <Box textAlign="center">
            <Heading as="h1" size="xl" mb={2}>
              HubSpot Integration
            </Heading>
            <Text color="gray.600">
              Connect your HubSpot account to enable powerful CRM integration features.
            </Text>
          </Box>

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="sm">
            <ConnectionStatus 
              isConnected={isConnected} 
              expiresAt={tokenData?.expires_at ? new Date(tokenData.expires_at) : undefined} 
            />
            
            <Box mt={6} textAlign="center">
              {isConnected ? (
                <Button 
                  colorScheme="red" 
                  onClick={disconnectFromHubSpot} 
                  isLoading={isLoading}
                >
                  Disconnect from HubSpot
                </Button>
              ) : (
                <Button 
                  colorScheme="blue" 
                  onClick={connectToHubSpot} 
                  isLoading={isLoading}
                >
                  Connect to HubSpot
                </Button>
              )}
            </Box>
          </Box>

          {isConnected && tokenData && (
            <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="sm">
              <Heading as="h3" size="md" mb={4}>
                Connection Details
              </Heading>
              <Stack spacing={3}>
                <Text>
                  <strong>Provider:</strong> {tokenData.provider}
                </Text>
                <Text>
                  <strong>Created:</strong> {new Date(tokenData.created_at).toLocaleString()}
                </Text>
                <Text>
                  <strong>Last Updated:</strong> {new Date(tokenData.updated_at).toLocaleString()}
                </Text>
              </Stack>
            </Box>
          )}
        </Stack>
      </Container>
    </>
  );
}
