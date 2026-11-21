import ReactDOM from 'react-dom/client';
import { createGlobalStyle } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { I18nProvider } from './src/i18n';
import DesignList from './src/dashboard/DesignList';
import DesignEdit from './src/dashboard/DesignEdit';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    height: 100%;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }
`;

const App = () => {
  return (
    <I18nProvider>
      <Router>
        <GlobalStyle />
        <Routes>
          <Route path="/" element={<DesignList />} />
          <Route path="/design/:designId" element={<DesignEdit />} />
        </Routes>
      </Router>
    </I18nProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
