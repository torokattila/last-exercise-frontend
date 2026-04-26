import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import LoadingScreen from './components/LoadingScreen';
import useAuth from './hooks/useAuth';
import usePushNotification from './hooks/usePushNotification';
import Router from './routes';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'NunitoSans',
  },
});

const App = (): JSX.Element => {
  const { isInitialized, isAuthenticated } = useAuth();
  const { registerPushToken } = usePushNotification();
  const queryClient = new QueryClient();

  useEffect(() => {
    if (isAuthenticated) {
      registerPushToken();
    }
  }, [isAuthenticated, registerPushToken]);

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        {isInitialized ? <Router /> : <LoadingScreen />}
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
