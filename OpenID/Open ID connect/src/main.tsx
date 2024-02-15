import ReactDOM from 'react-dom/client';
import App from './App';

import { Auth0Provider } from '@auth0/auth0-react';

const domain = "dev-kgepirlxe75llgds.us.auth0.com";
const clientId = "yKUANRLBVrhoC1OzbWl2ELa4sbxCm7iy";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Auth0Provider
        domain={domain}
        clientId={clientId}
        redirectUri={window.location.origin}
    >
        <App />
    </Auth0Provider>
);
