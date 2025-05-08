const { generateKeyPairSync } = require('crypto');
const { writeFileSync } = require('fs');
const selfsigned = require('selfsigned');

// Générer une paire de clé RSA
const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

// Générer un certificat auto-signé
const attrs = [{ name: 'commonName', value: 'localhost' }];
const pems = selfsigned.generate(attrs, { keySize: 2048, days: 365 });

// Sauvegarder les fichiers
writeFileSync('key.pem', pems.private);
writeFileSync('cert.pem', pems.cert);

console.log('✅ Certificat SSL généré dans sslcert/ (key.pem et cert.pem)');
