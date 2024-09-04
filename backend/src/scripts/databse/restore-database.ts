import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import env from '../../config/environment';

const restoreDatabase = async () => {
  const backupDir = path.join(__dirname, 'database_backups');

  try {
    // Get list of backup files
    const files = await fs.readdir(backupDir);
    const backupFiles = files.filter(file => file.startsWith('backup_') && file.endsWith('.gz'));

    if (backupFiles.length === 0) {
      console.log('No backup files found.');
      return;
    }

    // Sort backup files by date (newest first)
    backupFiles.sort((a, b) => b.localeCompare(a));

    // Use the most recent backup file
    const latestBackup = backupFiles[0];
    const backupPath = path.join(backupDir, latestBackup);

    // Construct mongorestore command
    const command = `mongorestore --host=${env.DB_HOST} --db=${env.DB_NAME} --username=${env.DB_USER} --password=${env.DB_PASS} --gzip --archive=${backupPath} --drop`;

    // Execute mongorestore
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`Database restored successfully from ${backupPath}`);
    });
  } catch (error) {
    console.error('Error restoring database:', (error as Error).message);
  }
};

restoreDatabase();