import ReactDOM from 'react-dom/client';
import App from './App';

import { Auth0Provider } from '@auth0/auth0-react';

const domain = "dev-spdnexpuf8hzfcfu.us.auth0.com";
const clientId = "Bm8lNhOVuyNT5vXkd03StDVsB6Hbveg9";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={
            {redirect_uri: window.location.origin, audience: "unique identifier", scope: "openid profile email"}}
    >
        <App />
    </Auth0Provider>
);