import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';

import app from './app.js';
import connectDB from './config/database.js';
import env from './config/environment.js';

const HTTPS_PORT = env.PORT;
const HTTP_PORT = env.PORT_HTTP;

const options = {
  //key: fs.readFileSync(path.join(__dirname, '../ssl/cert/private-key.pem')),
  //cert: fs.readFileSync(path.join(__dirname, '../ssl/cert/certificate.pem'))
  key: fs.readFileSync(path.join('/app/cert/private-key.pem')),
  cert: fs.readFileSync(path.join('/app/cert/certificate.pem'))
};

const startServer = async () => {
  try {
    await connectDB();

    // create HTTPS server
    const server = https.createServer(options, app);
    server.listen(HTTPS_PORT, () => {
      console.log(`HTTPS Server running in ${env.NODE_ENV} mode on port ${HTTPS_PORT}`);
    });

    // Create a separate HTTP server that redirects all requests to HTTPS
    const httpServer = http.createServer((req, res) => {
      res.writeHead(301, { "Location": `https://${req.headers.host.split(':')[0]}:${HTTPS_PORT}${req.url}` });
      res.end();
    });

    httpServer.listen(HTTP_PORT, () => {
      console.log(`HTTP Server running on port ${HTTP_PORT}, redirecting all traffic to HTTPS`);
    });

  } catch (error) {
    console.error('Failed to start the server:', error.message);
    process.exit(1);
  }
};

startServer();
