import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import env from '../../src/config/environment';

const backupDatabase = async () => {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const backupDir = path.join(__dirname, 'database_backups');
  const backupPath = path.join(backupDir, `backup_${timestamp}.gz`);

  try {
    // Create backup directory if it doesn't exist
    await fs.mkdir(backupDir, { recursive: true });

    // Construct mongodump command
    const command = `mongodump --host=${env.DB_HOST} --db=${env.DB_NAME} --username=${env.DB_USER} --password=${env.DB_PASS} --gzip --archive=${backupPath}`;

    // Execute mongodump
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`Database backup created successfully at ${backupPath}`);
    });
  } catch (error) {
    console.error('Error creating database backup:', (error as Error).message);
  }
};

backupDatabase();