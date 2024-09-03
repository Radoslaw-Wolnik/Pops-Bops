// src/config/environment.ts

import fs from 'fs';

interface Environment {
  DB_HOST: string;
  DB_NAME: string;
  DB_USER: string;
  DB_PASS: string;
  DB_URI: string;
  JWT_SECRET: string;
  PORT: number;
  NODE_ENV: string;
  FRONTEND: string;
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USER: string;
  EMAIL_PASS: string;
  EMAIL_FROM: string;
  ENCRYPTION_KEY: string;
  OLD_ENCRYPTION_KEY: string;
  ROTATION_IN_PROGRESS: boolean;
}
/*
function readSecret(path: string): string {
  try {
    return fs.readFileSync(path, 'utf8').trim();
  } catch (error) {
    console.error(`Error reading secret from ${path}:`, error);
    return '';
  }
}
*/
function getEnvValue(key: string, defaultValue: string = ''): string {
  // First, try to read from a secret file
  const secretPath = process.env[`${key}_FILE`];
  if (secretPath) {
    try {
      return fs.readFileSync(secretPath, 'utf8').trim();
    } catch (error) {
      console.error(`Error reading secret from ${secretPath}:`, error);
    }
  }
  
  // If secret file doesn't exist or couldn't be read, return the environment variable or default value
  return process.env[key] || defaultValue;
}

const env: Environment = {
  DB_HOST: getEnvValue('DB_HOST', 'mongo'),
  DB_NAME: getEnvValue('DB_NAME'),
  DB_USER: getEnvValue('DB_USER'),
  DB_PASS: getEnvValue('DB_PASSWORD'),
  JWT_SECRET: getEnvValue('JWT_SECRET'),
  PORT: parseInt(getEnvValue('PORT', '5000'), 10),
  NODE_ENV: getEnvValue('NODE_ENV', 'development'),
  FRONTEND: getEnvValue('FRONTEND', 'https://localhost:5173'),
  EMAIL_HOST: getEnvValue('EMAIL_HOST'),
  EMAIL_PORT: parseInt(getEnvValue('EMAIL_PORT', '587'), 10),
  EMAIL_USER: getEnvValue('EMAIL_USER'),
  EMAIL_PASS: getEnvValue('EMAIL_PASSWORD'),
  EMAIL_FROM: getEnvValue('EMAIL_FROM'),
  ENCRYPTION_KEY: getEnvValue('ENCRYPTION_KEY'),
  OLD_ENCRYPTION_KEY: getEnvValue('OLD_ENCRYPTION_KEY', ''),
  ROTATION_IN_PROGRESS: getEnvValue('ROTATION_IN_PROGRESS', 'false') === 'true',
  get DB_URI() {
    return `mongodb://${this.DB_USER}:${this.DB_PASS}@${this.DB_HOST}:27017/${this.DB_NAME}?authMechanism=SCRAM-SHA-256`;
    //  return `mongodb://${this.DB_USER}:${this.DB_PASS}@mongo:27017/${this.DB_NAME}?authMechanism=SCRAM-SHA-256`,
  },
};

export default env;