import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import GlobalStyles from './components/GlobalStyles/GlobalStyles';
import App from './App';
import "./firebase/config";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <GlobalStyles>
            <App />
        </GlobalStyles>
    </StrictMode>
);
