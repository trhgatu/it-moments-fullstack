import { createRoot } from 'react-dom/client';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import GlobalStyles from './components/GlobalStyles/GlobalStyles';
import App from './App';
import "./firebase/config";
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
createRoot(document.getElementById('root')).render(
    <UserProvider>
        <BrowserRouter>
            <GlobalStyles>
                <App />
            </GlobalStyles>
        </BrowserRouter>
    </UserProvider>
);
