// sth like that:
import fs from 'fs';

interface Environment {
  API_URL: string;
}

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
  API_URL: getEnvValue('VITE_API_URL'), // || 'https://localhost:5443/api',
}

export default env;
