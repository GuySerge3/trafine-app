const express = require('express');
const https = require('https');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();


const privateKey = fs.readFileSync('./sslcert/key.pem', 'utf8');
const certificate = fs.readFileSync('./sslcert/cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };


app.use('/api/auth', createProxyMiddleware({ target: process.env.AUTH_SERVICE_URL, changeOrigin: true }));
app.use('/api/users', createProxyMiddleware({ target: process.env.USER_SERVICE_URL, changeOrigin: true }));
app.use('/api/routes', createProxyMiddleware({ target: process.env.ROUTE_SERVICE_URL, changeOrigin: true }));
app.use('/api/incidents', createProxyMiddleware({ target: process.env.INCIDENT_SERVICE_URL, changeOrigin: true }));
app.use('/api/alerts', createProxyMiddleware({ target: process.env.ALERT_SERVICE_URL, changeOrigin: true }));
app.use('/api/stats', createProxyMiddleware({ target: process.env.STATS_SERVICE_URL, changeOrigin: true }));

app.get('/', (req, res) => {
  res.send('🚀 Trafine API Gateway running over HTTPS');
});

const httpsServer = https.createServer(credentials, app);


httpsServer.listen(3000, () => {
  console.log('🚀 Gateway HTTPS lancé sur https://localhost:3000');
});
