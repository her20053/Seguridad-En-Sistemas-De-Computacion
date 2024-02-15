require('dotenv').config();
const express = require('express');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');

const app = express();

app.use(cors());

// Middleware para imprimir el token JWT recibido
const printToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        const token = bearerHeader.split(' ')[1];
        console.log("Token recibido:", token);
    } else {
        console.log("No se recibió token en la solicitud.");
    }
    next(); // Pasar al siguiente middleware
};

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://dev-kgepirlxe75llgds.us.auth0.com/.well-known/jwks.json`
    }),
    audience: 'https://api.canekopenid.com',
    issuer: `https://dev-kgepirlxe75llgds.us.auth0.com/`,
    algorithms: ['RS256']
});

app.get('/protected', printToken, checkJwt, (req, res) => {
    res.send({
        message: "El contenido protegido ha sido accesado con éxito.",
        user: req.user
    });
});

// Manejador de errores para cuando falla la autenticación
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        console.error("El token no es válido. desde el manejador de errores");
        res.status(401).send({ error: 'Token inválido o no provisto.' });
    } else {
        next(err);
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
