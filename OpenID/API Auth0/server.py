from flask import Flask, request, jsonify
from auth0.v3.authentication.token_verifier import TokenVerifier, AsymmetricSignatureVerifier

app = Flask(__name__)

AUTH0_DOMAIN = 'tu_dominio_de_auth0'
API_IDENTIFIER = 'tu_identificador_de_api'

@app.route('/')
def handle_request():
    token = request.headers.get('Authorization', None).split()[1]
    jwks_url = f'https://{AUTH0_DOMAIN}/.well-known/jwks.json'
    issuer = f'https://{AUTH0_DOMAIN}/'

    try:
        signature_verifier = AsymmetricSignatureVerifier(jwks_url)
        token_verifier = TokenVerifier(signature_verifier, issuer, API_IDENTIFIER)
        token_verifier.verify(token)

        # Lógica después de la verificación exitosa del token
        return jsonify({"message": "Token verificado con éxito"}), 200

    except Exception as e:
        return jsonify({"message": "Token no válido", "error": str(e)}), 401

if __name__ == '__main__':
    app.run(port=7777)
