// src/config/environment.ts

import fs from 'fs';

interface Environment {
  DB_HOST: string;
  DB_NAME: string;
  DB_USER: string;
  DB_PASS: string;
  JWT_SECRET: string;
  PORT: number;
  PORT_HTTP: number;
  NODE_ENV: string;
  FRONTEND: string;
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USER: string;
  EMAIL_PASS: string;
  EMAIL_FROM: string;
  ENCRYPTION_KEY: string;
}

function readSecret(path: string): string {
  try {
    return fs.readFileSync(path, 'utf8').trim();
  } catch (error) {
    console.error(`Error reading secret from ${path}:`, error);
    return '';
  }
}

const env: Environment = {
  DB_HOST: process.env.DB_HOST || 'mongo',
  DB_NAME: readSecret(process.env.DB_NAME_FILE || '/run/secrets/db_name'),
  DB_USER: readSecret(process.env.DB_USER_FILE || '/run/secrets/db_user'),
  DB_PASS: readSecret(process.env.DB_PASS_FILE || '/run/secrets/db_password'),
  JWT_SECRET: readSecret(process.env.JWT_SECRET_FILE || '/run/secrets/jwt_secret'),
  PORT: parseInt(process.env.PORT || '5443', 10),
  PORT_HTTP: parseInt(process.env.PORT_HTTP || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND: process.env.FRONTEND || 'https://localhost:5173',
  EMAIL_HOST: readSecret(process.env.EMAIL_HOST_FILE || '/run/secrets/email_host'),
  EMAIL_PORT: parseInt(readSecret(process.env.EMAIL_PORT_FILE || '/run/secrets/email_port'), 10),
  EMAIL_USER: readSecret(process.env.EMAIL_USER_FILE || '/run/secrets/email_user'),
  EMAIL_PASS: readSecret(process.env.EMAIL_PASSWORD_FILE || '/run/secrets/email_password'),
  EMAIL_FROM: readSecret(process.env.EMAIL_FROM_FILE || '/run/secrets/email_from'),
  ENCRYPTION_KEY: readSecret(process.env.ENCRYPTION_KEY || '/run/secrets/encryption_key'),
};

export default env;