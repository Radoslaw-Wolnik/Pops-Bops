import https from 'https';
import fs from 'fs';

import app from './app.js';
import connectDB from './config/database.js';
import env from './config/environment.js';

const PORT = env.PORT;

const options = {
  //key: fs.readFileSync(path.join(__dirname, '../ssl/cert/private-key.pem')),
  //cert: fs.readFileSync(path.join(__dirname, '../ssl/cert/certificate.pem'))
  key: fs.readFileSync(path.join('/app/cert/private-key.pem')),
  cert: fs.readFileSync(path.join('/app/cert/certificate.pem'))
};

const startServer = async () => {
  try {
    await connectDB();
    const server = https.createServer(options, app);
    server.listen(PORT, () => {
      console.log(`HTTPS Server running in ${env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error.message);
    process.exit(1);
  }
};

startServer();
