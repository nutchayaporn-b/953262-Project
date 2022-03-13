// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';

import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <AuthProvider>
      <Toaster />
      <ThemeConfig>
        <ScrollToTop />
        <GlobalStyles />
        <BaseOptionChartStyle />
        <Router />
      </ThemeConfig>
    </AuthProvider>
  );
}
