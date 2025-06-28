import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import '@fontsource/inter';
import type { AppProps } from 'next/app';

const theme = extendTheme({
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  colors: {
    brand: {
      50: '#e3f9f6',
      100: '#c1e3e0',
      200: '#9ecdc9',
      300: '#7cb7b3',
      400: '#59a19d',
      500: '#408784', // Apex blue-green
      600: '#326a67',
      700: '#244d4a',
      800: '#16302d',
      900: '#081310',
    },
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode('gray.50', 'gray.900')(props),
        color: mode('gray.800', 'gray.100')(props),
        fontFamily: 'Inter, sans-serif',
      },
    }),
  },
  initialColorMode: 'light',
  useSystemColorMode: true,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
